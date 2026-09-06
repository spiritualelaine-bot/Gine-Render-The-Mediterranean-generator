import os
import streamlit as st
from openai import OpenAI

# Streamlit Page Config
st.set_page_config(page_title="Sovereign Content Engine", layout="wide")
st.title("⚡ E-Book & Blog Automated Generator")

# API Setup using Groq's Free Endpoint
api_key = st.text_input("Enter your Free Groq API Key:", type="password")

if api_key:
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=api_key,
    )

    # Form Inputs
    content_type = st.selectbox("Type", ["Blog Post", "E-Book Chapter"])
    topic = st.text_input("Topic / Hook", "The Power of Sovereign Automation")
    cta_target = st.text_input("Call To Action", "Join the Coaching Program")

    if st.button("Generate Content"):
        with st.spinner("Drafting..."):
            prompt = f"""
            Write a high-converting {content_type} on: '{topic}'.
            Structure:
            1. Strong Hook / Pattern Interrupt
            2. High-value actionable advice
            3. End with a compelling Call to Action directing them to: {cta_target}
            """
            
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}]
            )
            
            output = response.choices[0].message.content
            st.markdown(output)
            st.download_button("Download Markdown", output, file_name="generated_content.md")
