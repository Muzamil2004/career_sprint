const CODE_EXEC_API = `${import.meta.env.VITE_API_URL}/code/execute`;

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const response = await fetch(CODE_EXEC_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
        output: details,
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
