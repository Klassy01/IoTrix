from models import ChatMessage
import os
import logging
from sqlalchemy.orm import Session

# Configure logging
logger = logging.getLogger(__name__)

# ✅ Check for API key and configure AI
try:
    import google.generativeai as genai
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("OPENAI_API_KEY")
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

# ✅ IoT Keywords (Comprehensive)
IOT_KEYWORDS = [
    # General IoT
    "iot", "internet of things", "smart device", "connected device", "embedded system",
    "wearables", "m2m", "machine to machine", "cyber physical system", "industry 4.0",

    # Hardware & Boards
    "sensor", "actuator", "microcontroller", "raspberry pi", "arduino", "esp32", "esp8266",
    "stm32", "nrf52", "beaglebone", "edge device", "gateway", "plc", "fpga", "asic",
    "microchip", "soc", "nvidia jetson", "tensilica", "ai accelerator",

    # Communication Protocols
    "mqtt", "coap", "http", "https", "rest api", "websocket", "amqp",
    "zigbee", "zwave", "lorawan", "lpwan", "nb-iot", "lte-m", "6g",
    "bluetooth", "bluetooth low energy", "ble", "rfid", "nfc", "wifi", "ethernet",
    "5g", "4g", "zigbee pro", "thread protocol", "opc ua", "modbus", "can bus", "profibus",

    # Platforms & Cloud
    "aws iot", "azure iot", "google cloud iot", "ibm watson iot", "thingsboard",
    "blynk", "firebase iot", "node-red", "kafka", "hive mqtt broker", "mosquitto",

    # Security & Device Management
    "iot security", "ota update", "firmware update", "device provisioning",
    "digital twin", "edge computing", "fog computing", "data acquisition",
    "device authentication", "secure boot", "tls", "ssl", "encryption",
    "zero trust iot", "blockchain iot", "authentication token",

    # Use Cases
    "smart home", "smart city", "industrial iot", "iiot", "agriculture iot",
    "predictive maintenance", "remote monitoring", "home automation", "connected car",
    "healthcare iot", "wearable iot", "fleet management", "logistics tracking",
    "asset tracking", "smart grid", "energy monitoring", "smart factory",

    # Data & AI in IoT
    "telemetry", "real-time monitoring", "data logging", "time series",
    "sensor fusion", "big data iot", "edge ai", "ml on edge", "analytics",
    "tensorflow lite", "tinyml", "autoencoder", "inference on edge",

    # Operating Systems
    "freeRTOS", "mbed OS", "zephyr OS", "riot OS", "tinyOS", "contiki",

    # Energy & Optimization
    "low power", "battery optimization", "energy harvesting",
    "sleep mode", "power management",

    # Standards & Architecture
    "ipv6", "6lowpan", "opc ua", "modbus", "can bus", "knx",
    "bacnet", "zigbee green power", "iot architecture", "iot framework",
    "protocol stack", "lpwan standard", "oneM2M", "etsi standard"
]


# ✅ Computer Network Keywords (Comprehensive)
NETWORK_KEYWORDS = [
    # General
    "network", "cn", "computer network", "data communication", "network topology",
    "peer to peer", "client server", "mesh network", "ring topology", "bus topology",

    # OSI & TCP/IP
    "osi model", "tcp/ip model", "layer 1", "layer 2", "layer 3", "layer 4",
    "physical layer", "data link layer", "network layer", "transport layer",
    "application layer", "session layer", "presentation layer",

    # Devices
    "switch", "router", "hub", "bridge", "repeater", "firewall", "gateway",
    "access point", "network interface card", "modem", "proxy server", "load balancer",

    # Protocols
    "ip", "ipv4", "ipv6", "tcp", "udp", "http", "https", "ftp", "tftp",
    "smtp", "pop3", "imap", "dns", "dhcp", "telnet", "ssh", "icmp",
    "arp", "rip", "ospf", "bgp", "mpls", "eigrp", "stp", "vrrp",
    "gre tunnel", "vxlan", "ppp", "pptp", "l2tp",

    # Networking Concepts
    "mac address", "ip address", "subnet", "subnetting", "cidr", "routing",
    "static routing", "dynamic routing", "nat", "port forwarding",
    "bandwidth", "latency", "throughput", "jitter", "qos", "mtu",
    "collision domain", "broadcast domain",

    # Security
    "network security", "vpn", "vpn tunneling", "ipsec", "ssl", "tls",
    "firewall rules", "ddos", "intrusion detection", "ids", "ips",
    "access control list", "zero trust", "wpa3", "wpa2", "802.1x",

    # Wireless & Modern Networks
    "wifi", "5g", "4g", "3g", "lte", "wlan", "wwan", "man", "lan", "wan", "san",
    "vpn", "cloud networking", "sdn", "nfv", "overlay network", "vlan",

    # Data Transmission
    "packet", "frame", "mtu", "encapsulation", "decapsulation",
    "error detection", "crc", "checksum", "flow control", "congestion control",

    # Network Tools
    "ping", "traceroute", "netstat", "wireshark", "packet sniffer", "nmap",
    "ipconfig", "ifconfig", "tcpdump",

    # Virtualization & Cloud
    "virtual network", "vlan", "vxlan", "overlay network", "cloud vpc",
    "network function virtualization", "kubernetes networking", "cni plugins",

    # Emerging Tech
    "software defined networking", "network automation", "zero trust network",
    "network virtualization", "edge networking", "sase architecture"
]


# ✅ Check topic relevance
def detect_topic(message: str) -> str:
    msg = message.lower()
    if any(k in msg for k in IOT_KEYWORDS):
        return "iot"
    if any(k in msg for k in NETWORK_KEYWORDS):
        return "network"
    return None

# ✅ Bot Response
def get_bot_response(user_message: str, db: Session):
    try:
        topic = detect_topic(user_message)

        if topic is None:
            return "⚠️ I am an IoT & Computer Network assistant. Please ask related questions."

        logger.info(f"🔍 User Message: {user_message[:50]}... | Topic: {topic}")

        # Check if AI model is available
        if model is None:
            # Fallback responses when no AI model is available
            fallback_responses = {
                "iot": "IoT devices connect everyday objects to the internet, enabling data collection and remote control. Common examples include smart thermostats, security cameras, and fitness trackers.",
                "network": "Computer networks enable devices to communicate and share resources. Key concepts include routers, switches, IP addresses, and protocols like TCP/IP.",
                "sensor": "Sensors collect data from the environment (temperature, humidity, motion, etc.) and convert it to digital signals for processing by IoT devices.",
                "protocol": "Communication protocols define how devices exchange data. Popular IoT protocols include MQTT, CoAP, and HTTP/HTTPS.",
                "security": "IoT security involves protecting connected devices from cyber threats through encryption, secure authentication, and regular firmware updates."
            }
            
            # Simple topic matching for fallback
            for key in fallback_responses:
                if key in user_message.lower():
                    bot_reply = fallback_responses[key]
                    break
            else:
                bot_reply = "I'm currently running in demo mode. For full AI responses, please configure an API key in the environment variables."
        else:
            # Use AI model when available
            prompt = f"""Answer this {topic.upper()} question in detail. 
            Use simple formatting:
            - Use bullet points (•) or dashes (-) instead of asterisks
            - Don't use markdown formatting like **bold** or *italic*
            - Use clear, simple text formatting
            - Make the response easy to read
            
            Question: {user_message}"""
            
            response = model.generate_content(prompt)
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
        return "⚠️ Sorry, something went wrong while generating the response."
