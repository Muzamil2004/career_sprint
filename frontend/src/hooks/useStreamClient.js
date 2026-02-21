import { useState, useEffect, useCallback, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);
  const callRef = useRef(null);
  const chatClientRef = useRef(null);

  const teardownSessionMedia = useCallback(async () => {
    try {
      if (callRef.current) {
        await callRef.current.leave();
        callRef.current = null;
      }
      if (chatClientRef.current) {
        await chatClientRef.current.disconnectUser();
        chatClientRef.current = null;
      }
      await disconnectStreamClient();
    } catch (error) {
      console.error("Cleanup error:", error);
    } finally {
      setCall(null);
      setChatClient(null);
      setChannel(null);
      setStreamClient(null);
    }
  }, []);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        setCall(videoCall);
        callRef.current = videoCall;

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );
        setChatClient(chatClientInstance);
        chatClientRef.current = chatClientInstance;

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (session && !loadingSession) initCall();

    // cleanup - performance reasons
    return () => {
      // iife
      (async () => {
        if (videoCall || chatClientInstance) {
          callRef.current = videoCall || callRef.current;
          chatClientRef.current = chatClientInstance || chatClientRef.current;
        }
        await teardownSessionMedia();
      })();
    };
  }, [session, loadingSession, isHost, isParticipant, teardownSessionMedia]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
    teardownSessionMedia,
  };
}

export default useStreamClient;
