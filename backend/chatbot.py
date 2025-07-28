from models import ChatMessage
import os
import logging
from sqlalchemy.orm import Session

# Configure logging
logger = logging.getLogger(__name__)

# ✅ Check for API key and configure AI
try:
    import google.generativeai as genai
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("OPENAI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("models/gemini-1.5-flash")
        logger.info("✅ AI model configured successfully")
    else:
        model = None
        logger.warning("⚠️ No API key found - using fallback responses")
except Exception as e:
    model = None
    logger.warning(f"⚠️ AI model setup failed: {e} - using fallback responses")

# ✅ AI-Based Topic Detection
def detect_topic_with_ai(message: str) -> str:
    """Use AI to intelligently detect if the question is related to IoT or Computer Networks"""
    if model is None:
        return "general"
    
    try:
        classification_prompt = f"""
        Analyze this question and classify it into ONE of these categories:
        1. "iot" - Questions about Internet of Things, smart devices, sensors, embedded systems, IoT protocols, smart homes, industrial IoT, etc.
        2. "network" - Questions about computer networks, networking protocols, routers, switches, network security, TCP/IP, etc.
        3. "both" - Questions that involve both IoT and networking concepts
        4. "unrelated" - Questions not related to IoT or computer networks
        
        Question: "{message}"
        
        Respond with ONLY one word: iot, network, both, or unrelated
        """
        
        response = model.generate_content(classification_prompt)
        topic = response.text.strip().lower() if response and response.text else "unrelated"
        
        # Validate response
        valid_topics = ["iot", "network", "both", "unrelated"]
        if topic in valid_topics:
            return topic
        else:
            return "unrelated"
            
    except Exception as e:
        logger.warning(f"AI topic detection failed: {e}")
        return "general"

# ✅ Enhanced Bot Response with Better Prompting
def get_bot_response(user_message: str, db: Session):
    try:
        # Use AI-based topic detection
        topic = detect_topic_with_ai(user_message)
        
        logger.info(f"🔍 User Message: {user_message[:50]}... | AI-Detected Topic: {topic}")

        if topic == "unrelated":
            return """⚠️ I'm IoTrix, your specialized assistant for IoT (Internet of Things) and Computer Networks. 

I can help you with:
• IoT devices, sensors, and smart systems
• Network protocols and architecture  
• Troubleshooting connectivity issues
• IoT security and best practices
• Smart home and industrial IoT solutions

Please ask a question related to these topics!"""

        # Check if AI model is available
        if model is None:
            # Enhanced fallback responses
            fallback_responses = {
                "iot": """IoT (Internet of Things) connects everyday objects to the internet for data collection and remote control.

Key Components:
• Sensors (temperature, humidity, motion, light)
• Actuators (motors, valves, switches)
• Microcontrollers (Arduino, Raspberry Pi, ESP32)
• Communication protocols (WiFi, Bluetooth, MQTT)
• Cloud platforms for data processing

Common Applications:
• Smart homes (thermostats, security cameras)
• Industrial monitoring and automation
• Healthcare devices and wearables
• Smart cities and transportation

Would you like to know more about any specific IoT aspect?""",
                
                "network": """Computer Networks enable devices to communicate and share resources.

Core Concepts:
• Network topology (star, mesh, ring, bus)
• OSI model and TCP/IP stack
• IP addressing and subnetting
• Routing and switching
• Network protocols (HTTP, FTP, DNS, DHCP)

Key Devices:
• Routers (connect different networks)
• Switches (connect devices in same network)
• Firewalls (network security)
• Access points (wireless connectivity)

Would you like help with a specific networking topic?""",
                
                "both": """IoT and Computer Networks work together to create connected systems.

Integration Points:
• IoT devices use network protocols to communicate
• Edge computing brings processing closer to IoT sensors
• Cloud connectivity for data storage and analysis
• Network security is crucial for IoT deployments
• Quality of Service (QoS) ensures reliable IoT communication

I can help with both IoT devices and the networks that connect them!"""
            }
            
            return fallback_responses.get(topic, fallback_responses["iot"])
        
        else:
            # Enhanced AI prompting based on detected topic
            if topic == "iot":
                system_prompt = """You are IoTrix, an expert IoT (Internet of Things) assistant. You specialize in:
- IoT devices, sensors, and actuators
- Microcontrollers (Arduino, Raspberry Pi, ESP32)
- IoT communication protocols (MQTT, CoAP, LoRaWAN)
- Smart home and industrial IoT applications
- IoT security and device management
- Edge computing and data collection

Provide detailed, practical answers with real-world examples."""

            elif topic == "network":
                system_prompt = """You are IoTrix, an expert Computer Networks assistant. You specialize in:
- Network architecture and topology
- TCP/IP, OSI model, and networking protocols
- Routers, switches, and network devices
- Network security and troubleshooting
- Wireless networks and connectivity
- Network configuration and administration

Provide clear explanations with practical troubleshooting steps."""

            elif topic == "both":
                system_prompt = """You are IoTrix, an expert in both IoT and Computer Networks. You specialize in:
- How IoT devices connect to networks
- IoT communication protocols and network integration
- Network infrastructure for IoT deployments
- Security considerations for connected IoT systems
- Edge computing and distributed IoT architectures

Provide comprehensive answers covering both IoT and networking aspects."""

            else:
                system_prompt = """You are IoTrix, an assistant specializing in IoT and Computer Networks. Analyze the question and provide relevant technical guidance."""

            # Create the complete prompt
            full_prompt = f"""{system_prompt}

Question: {user_message}

Instructions for your response:
1. Provide a clear, detailed answer
2. Use bullet points (•) for lists, not asterisks
3. Include practical examples when relevant
4. Avoid markdown formatting (**bold**, *italic*)
5. Make it easy to read and understand
6. If troubleshooting, provide step-by-step solutions
7. Keep the response focused and actionable"""
            
            response = model.generate_content(full_prompt)
            bot_reply = response.text if response and response.text else "⚠️ No response from AI model."
            
            # Clean up the response formatting
            if bot_reply:
                # Remove escaped characters and fix formatting
                bot_reply = bot_reply.replace('\\n', '\n').replace('\\"', '"').replace("\\'", "'")
                # Replace markdown formatting with simple formatting
                bot_reply = bot_reply.replace('**', '').replace('*', '•')
                # Remove any leading/trailing whitespace
                bot_reply = bot_reply.strip()

        # Save in DB
        try:
            chat = ChatMessage(user_message=user_message, bot_response=bot_reply)
            db.add(chat)
            db.commit()
            db.refresh(chat)
        except Exception as e:
            logger.warning(f"Database save failed: {e}")

        return bot_reply

    except Exception as e:
        logger.error(f"get_bot_response error: {e}")
        return "⚠️ Sorry, something went wrong while generating the response. Please try again."
