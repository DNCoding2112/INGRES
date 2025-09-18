# INGRES
An AI-powered virtual assistant for INGRES that enables natural language queries, real-time and historical groundwater data access, interactive visualizations, and multilingual support, making India’s groundwater resource assessments more accessible and user-friendly.

# 💧 AI-Driven ChatBOT for INGRES (India Ground Water Resource Estimation System)

An intelligent **virtual assistant** integrated with **INGRES**, designed to simplify access to India’s dynamic groundwater assessment data. Developed under the **Ministry of Jal Shakti** and the **Central Ground Water Board (CGWB)**, this project leverages **AI and NLP** to make groundwater resource data more accessible, interactive, and insightful.

---

## 📌 Background

The **Assessment of Dynamic Ground Water Resources of India** is conducted annually by the **Central Ground Water Board (CGWB)** and State/UT departments, coordinated by the **Central Level Expert Group (CLEG), DoWR, RD & GR, MoJS**.  
This assessment uses **INGRES**, a GIS-based web application built by **CGWB and IIT Hyderabad** ([INGRES Portal](https://ingres.iith.ac.in/home)).

The process involves:
- Estimating **annual groundwater recharge**
- Assessing **extractable resources**
- Evaluating **total extraction**
- Classifying assessment units (Block/Mandal/Taluk) as:  
  ✅ Safe | ⚠️ Semi-Critical | ❗ Critical | 🚫 Over-Exploited  

Currently, results are available through the portal, but due to the **vast database**, retrieving specific and historical insights is challenging for many users.

---

## 🚀 Proposed Solution

To enhance accessibility and usability, this project introduces an **AI-driven ChatBOT for INGRES**.  
The chatbot acts as a **virtual assistant**, enabling users to query groundwater data using **natural language** and receive instant insights.

---

## ✨ Key Features

- 🤖 **Intelligent Query Handling** – Search groundwater data using plain language questions  
- 📊 **Real-time & Historical Results** – Access both current and past groundwater assessments  
- 📈 **Interactive Visualizations** – Generate scientific charts, maps, and diagrams dynamically  
- 🌐 **Multilingual Support** – Supports English and major **Indian regional languages**  
- ⚡ **Seamless Integration** – Direct connection with INGRES database for instant retrieval  

---

## 📌 Impact

- Simplifies **data access** for researchers, planners, policymakers, and citizens  
- Promotes **informed decision-making** for groundwater resource management  
- Improves **user engagement** with the INGRES portal  
- Makes groundwater information more **accessible, transparent, and actionable**  

---

## 🏗️ Tech Stack

- **Frontend:** React / Next.js (Interactive UI)  
- **Backend:** FastAPI / Node.js  
- **Database:** INGRES (PostgreSQL + GIS)  
- **AI/NLP:** Sentence Transformers, Hugging Face, Google Generative AI  
- **Visualization:** Plotly, D3.js, or Matplotlib  
- **Deployment:** Docker + Cloud (AWS / Azure / GCP)  

---

## ⚙️ Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-org>/ingres-chatbot.git
   cd ingres-chatbot
