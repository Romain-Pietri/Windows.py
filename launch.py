import os
import subprocess
import webbrowser
import time
import sys

# Définir les chemins
BACKEND_DIR = os.path.join(os.getcwd(), "Backend")
FRONTEND_DIR = os.path.join(os.getcwd(), "Front")
VENV_PATH = os.path.join(BACKEND_DIR, "venv")

def run_command(command, cwd=None, env=None):
    """Exécute une commande shell."""
    return subprocess.Popen(command, cwd=cwd, shell=True, env=env)

# Vérifier si l'environnement virtuel existe
if not os.path.exists(VENV_PATH):
    print("\033[1m[⚠️] Aucun environnement virtuel détecté, création de 'venv'...\033[0m")
    subprocess.run(f"python -m venv {VENV_PATH}", shell=True)

# Activer l'environnement virtuel
if sys.platform == "win32":
    activate_script = os.path.join(VENV_PATH, "Scripts", "activate")
else:
    activate_script = os.path.join(VENV_PATH, "bin", "activate")

print("\033[1m[🔧] Activation de l'environnement virtuel...\033[0m")
env = os.environ.copy()
env["VIRTUAL_ENV"] = VENV_PATH
env["PATH"] = os.path.join(VENV_PATH, "bin") + os.pathsep + env["PATH"]

# 🛠 Installation des dépendances
print("\033[1m[🚀] Installation des dépendances...\033[0m")

# Backend avec l'environnement virtuel
print("\033[1m[🔧] Installation des dépendances backend...\033[0m")
subprocess.run(f"{activate_script} && pip install -r requirements.txt", shell=True, cwd=BACKEND_DIR, env=env)

# Frontend
print("\033[1m[🔧] Installation des dépendances frontend...\033[0m")
subprocess.run("npm install", shell=True, cwd=FRONTEND_DIR)

# 🎬 Démarrage des serveurs
print("\033[1m[🔥] Démarrage du backend...\033[0m")
backend_process = run_command(f"{activate_script} && python manage.py runserver", cwd=BACKEND_DIR, env=env)

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
