import os
import subprocess
import webbrowser
import time

# Définir les chemins
BACKEND_DIR = os.path.join(os.getcwd(), "Backend")
FRONTEND_DIR = os.path.join(os.getcwd(), "Front")

def run_command(command, cwd=None):
    """Exécute une commande shell."""
    return subprocess.Popen(command, cwd=cwd, shell=True)

# 🛠 Installation des dépendances
print("\033[1m[🚀] Installation des dépendances...\033[0m")

# Backend
print("\033[1m[🔧] Installation des dépendances backend...\033[0m")
subprocess.run("pip install -r requirements.txt", shell=True, cwd=BACKEND_DIR)

# Frontend
print("\033[1m[🔧] Installation des dépendances frontend...\033[0m")
subprocess.run("npm install", shell=True, cwd=FRONTEND_DIR)

# 🎬 Démarrage des serveurs
print("\033[1m[🔥] Démarrage du backend...\033[0m")
backend_process = run_command("python manage.py runserver", cwd=BACKEND_DIR)

# Attendre que le backend démarre
time.sleep(3)

print("\033[1m[⚡] Démarrage du frontend...\033[0m")
frontend_process = run_command("npm run start", cwd=FRONTEND_DIR)

# Attendre que le front démarre
time.sleep(5)

# 🌍 Ouvrir l'application dans le navigateur
URL = "http://localhost:3000/"
print(f"\033[1m[🌐] Ouverture du navigateur sur {URL}...\033[0m")
webbrowser.open(URL)

# Maintenir le script en cours pour éviter qu'il ne se termine immédiatement
try:
    backend_process.wait()
    frontend_process.wait()
except KeyboardInterrupt:
    print("\n\033[1m[🛑] Arrêt des processus...\033[0m")
    backend_process.terminate()
    frontend_process.terminate()
    print("\033[1m[✅] Tout est arrêté proprement.\033[0m")
