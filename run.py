# AI assistance disclosure (applies to this project): ChatGPT, OpenAI Codex,
# Google Gemini, and GitHub Copilot were used as learning and collaboration
# tools for planning, researching libraries, explaining code, debugging,
# reviewing, and suggesting or helping implement improvements. The author made
# the project decisions, integrated the changes, manually tested the features,
# and reviewed the submitted code.

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
