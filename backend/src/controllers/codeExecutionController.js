const JUDGE0_API = "https://ce.judge0.com/submissions/?base64_encoded=false&wait=true";

const LANGUAGE_IDS = {
  javascript: 93, // JavaScript (Node.js 18.15.0)
  python: 71, // Python (3.8.1)
  java: 62, // Java (OpenJDK 13.0.1)
};

function normalizeJavaSource(code) {
  // Judge0 expects the entry class to be named `Main` for Java.
  if (/\bclass\s+Main\b/.test(code)) return code;

  return code.replace(
    /\b(public\s+)?class\s+([A-Za-z_][A-Za-z0-9_]*)\b/,
    (_, publicKeyword) => `${publicKeyword || ""}class Main`
  );
}

export async function executeCode(req, res) {
  try {
    const { language, code } = req.body || {};
    const languageId = LANGUAGE_IDS[language];

    if (!languageId || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid language or code payload",
      });
    }

    const sourceCode = language === "java" ? normalizeJavaSource(code) : code;

    const response = await fetch(JUDGE0_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return res.status(502).json({
        success: false,
        error: `Code execution provider error (${response.status})`,
        details,
      });
    }

    const data = await response.json();
    const stdout = data?.stdout || "";
    const stderr = data?.stderr || "";
    const compileOutput = data?.compile_output || "";
    const message = data?.message || "";
    const statusDescription = data?.status?.description || "Unknown";

    if (stderr || compileOutput || message || statusDescription !== "Accepted") {
      return res.status(200).json({
        success: false,
        output: stdout,
        error: stderr || compileOutput || message || statusDescription,
      });
    }

    return res.status(200).json({
      success: true,
      output: stdout || "No output",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Failed to execute code: ${error.message}`,
    });
  }
}
