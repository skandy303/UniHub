import openai
import os

openai.api_key = os.environ.get("OPENAI_KEY")


def get_description(description):
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Please provide a thorough description for a classified advertisement based on the following details: {description}",
            temperature=0,
            max_tokens=100,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )
        return {"Error": False, "Data": response}
    except Exception as e:
        return {"Error": True, "Message": str(e)}
