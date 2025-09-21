# In visualization_helper.py

import logging
import json

logger = logging.getLogger("rag_api")


# In visualization_helper.py

def generate_response_and_chart(model, user_query: str, context: str, persona: str, language: str):
    # ... (persona style logic remains the same) ...
    if persona == "Professional Assistant": style = "..."
    elif persona == "Field Technician": style = "..."
    elif persona == "Research Analyst": style = "..."
    else: style = ""

    # --- The final, structurally correct prompt ---
    prompt = f"""
    You are an expert data analyst acting as: {persona}.
    You MUST ALWAYS return a single, valid JSON object.

    The JSON object must have this exact structure:
    {{
      "html_answer": "<Your HTML response here>",
      "chart_data": {{
        "type": "bar",
        "data": {{
          "labels": ["Label 1", "Label 2"],
          "datasets": [{{ "label": "Dataset Label", "data": [10, 20] }}]
        }}
      }} OR null
    }}

    --- VERY IMPORTANT RULES ---
    1. The "html_answer" value MUST be a single-line JSON string. Use "<br>" for line breaks.
    2. If the 'Context' is empty or irrelevant, return this JSON:
       {{ "html_answer": "<div>I'm sorry, I could not find any data for that specific query.</div>", "chart_data": null }}
    --- END OF IMPORTANT RULES ---

    INSTRUCTIONS FOR 'html_answer' (Only if context is NOT empty):
    1. Adhere to your persona's style: {style}
    2. Answer in '{language}'.
    3. Format in clean HTML. For each distinct entry, wrap it in a `<div>` and use `<br>` between key-value pairs.

    INSTRUCTIONS FOR 'chart_data' (Only if context is NOT empty):
    1. Analyze the context for comparable numerical data.
    2. If such data exists, generate a chart object.
    3. If the context is a large data dump (>15 entries), return `null`.

    Context:
    {context}

    User Query: "{user_query}"
    """

    # ... The rest of your try/except block for calling the model and cleaning the JSON remains exactly the same ...
    try:
        response = model.generate_content(prompt)
        # Using the newer .removeprefix() and .removesuffix() available in Python 3.9+
        clean_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
        response_json = json.loads(clean_text)
        logger.info("Successfully generated and parsed structured response from Gemini.")
        return response_json
    except Exception as e:
        logger.error(f"Error processing Gemini response: {e}")
        logger.error(f"Raw Gemini response was: {response.text if 'response' in locals() else 'N/A'}")
        return {
            "html_answer": "<div>Sorry, an error occurred while processing the AI response.</div>",
            "chart_data": None
        }