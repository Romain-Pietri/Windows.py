import sqlite3

class FakeShell():
    """
    FakeShell a pour but de simuler un shell pour le projet
    """

    def __init__(self):
        # récupère l'historique des commandes sur la base de données SQL

        self.conn = sqlite3.connect('commands_history.db')
        self.cursor = self.conn.cursor()
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS history
                       (id INTEGER PRIMARY KEY, command TEXT)''')
        self.conn.commit()

        self.cursor.execute('SELECT command FROM history ORDER BY id DESC')
        rows = self.cursor.fetchall()
        self.history_tab = [row[0] for row in rows]


        
        self.current_directory = "/"
        self.userid = 0

    def historyAdd(self):
        """
        Ajoute la commande dans l'historique
        """
        self.cursor.execute(f"INSERT INTO history (command) VALUES ('{self.last_command()}')")
        self.conn.commit()
        self.cursor.execute('SELECT command FROM history ORDER BY id DESC')
        rows = self.cursor.fetchall()
        self.history_tab = [row[0] for row in rows]


    def get_history(self):
        """
        Retourne l'historique des commandes
        """
        return self.history
    
    def last_command(self):
        #recherche la dernière commande
        if len(self.history_tab) > 0:
            return self.history_tab[-1]
        return "No command in history"

    
    
    def ls(self):
        """
        Retourne la liste des fichiers et dossier du répertoire courant
        """
        return "List of files and directories"
    
    def pwd(self):
        """
        Retourne le répertoire courant
        """
        return "Current directory"

    def cd(self, directory):
        """
        Change le répertoire courant
        """
        return f"Directory changed to {directory}"
    
    def touch(self, filename):
        """
        Crée un fichier
        """
        return f"File {filename} created"
    
    def mkdir(self, directory):
        """
        Crée un dossier
        """
        return f"Directory {directory} created"
    
    def rm(self, filename):
        """
        Supprime un fichier
        """
        return f"File {filename} deleted"
    
    def rmdir(self, directory):
        """
        Supprime un dossier
        """
        return f"Directory {directory} deleted"
    
    def cat(self, filename):
        """
        Affiche le contenu d'un fichier
        """
        return f"Content of {filename}"
    
    def history(self):
        """
        Retourne l'historique des commandes
        """
        return self.history_tab

    def interpreter(self, command, userid="0"):
        """
        Interprète la commande donnée en argument
        """
        print("Command2:", command)
        fction = [self.ls, self.pwd, self.cd, self.touch, self.mkdir, self.rm, self.rmdir, self.cat, self.history]
        print("hello1")
        self.history_tab.append(command)
        self.historyAdd()
        print("hello2")
        self.userid = userid
        print("hello3")
        split_command = command.split()
        print("hello4")
        if len(split_command) == 0:
            return "No command given"
        print("hello5")
        if split_command[0] == "help":
            return "Available commands: help, ls, pwd, cd, history, touch, mkdir, rm, rmdir, cat"
    
        for i in range(len(fction)):
            if split_command[0] == fction[i].__name__:
                print("hello")
                return fction[i](*split_command[1:])
        return "Command not found"
    
        
