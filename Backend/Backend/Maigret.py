import os
import csv

def search_username(username):
    print(username)
    # fait une recherche sur le nom d'utilisateur grace a la commande maigret 
    os.system(f"maigret --no-color --no-progressbar -C {username}")
    
    # recupere le resultat a la fin de la recherche
    result = []

    # construit le chemin absolu vers le fichier de rapport
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    report_path = os.path.join(base_dir, "reports", f"report_{username}.csv")

    # ouvre le fichier contenant les resultats
    with open(report_path, newline='') as file:
        reader = csv.reader(file)
        for row in reader:
            result.append(row)

    # supprime le fichier de rapport
    os.remove(report_path)

    # renvoie uniquement les résultats positifs (avec "Claimed" dedans)
    result = [row for row in result if any("Claimed" in col for col in row)]
    
    return result