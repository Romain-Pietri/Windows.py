import sqlite3

class FakeShell():
    """
    FakeShell a pour but de simuler un shell pour le projet
    """

    def __init__(self):
        # récupère l'historique des commandes sur la base de données SQL

        self.conn = sqlite3.connect('DB.db')
        self.cursor = self.conn.cursor()
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS history
                       (id INTEGER PRIMARY KEY, command TEXT)''')
        self.conn.commit()

        self.cursor.execute('SELECT command FROM history ORDER BY id DESC')
        rows = self.cursor.fetchall()
        self.history_tab = [row[0] for row in rows]

        # Récupere la DB des fichiers et dossiers
        #Table (id, name, type, content, parent, owner)
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS files
                       (id INTEGER PRIMARY KEY, name TEXT, type TEXT, content TEXT, parent TEXT, owner INTEGER)''')
        self.conn.commit()

        self.current_directory = "/"
        self.userid = 0
        self.fction =[self.help,self.ls, self.pwd, self.cd, self.touch, self.mkdir, self.rm, self.rmdir, self.cat, self.history]
        

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
    
    def ls(self, *args):
        """
        Retourne la liste des fichiers et dossiers du répertoire courant
        """
        # si le arg contient -l alors on affiche les détails 
        if len(args) > 0 and args[0] == "-l":
            return self.ls_l()
        else:
            return self.ls_simple()
        
    def ls_simple(self):
        """
        Retourne la liste simple des fichiers et dossiers du répertoire courant
        """
        self.cursor.execute("SELECT name, type FROM files WHERE parent=? AND owner=?", (self.current_directory, self.userid))
        files = self.cursor.fetchall()
        return "\n".join([file[0] for file in files])
    
    def ls_l(self):
        """
        Retourne la liste détaillée des fichiers et dossiers du répertoire courant
        """
        self.cursor.execute("SELECT name, type FROM files WHERE parent=? AND owner=?", (self.current_directory, self.userid))
        files = self.cursor.fetchall()
        return "\n".join([f"{file[1]}: {file[0]}" for file in files])
    
    def pwd(self):
        """
        Retourne le répertoire courant
        """
        return self.current_directory

    def cd(self, directory:str):
        """
        Change le répertoire courant
        """

         #recherche si le dossier existe dans la bdd TODO
        self.cursor.execute("SELECT * FROM files WHERE name=? AND parent=? AND owner=?", (directory, self.current_directory, self.userid))
        dir_exists = self.cursor.fetchone()

        if not dir_exists:
            return f"Directory {directory} not found"

        if directory == "..":
            self.current_directory = "/".join(self.current_directory.split("/")[:-2]) + "/"
        else:

            self.current_directory +=directory + "/"

        return f"Directory changed to {directory}", self.current_directory
    
    def touch(self, filename):
        """
        Crée un fichier
        """
        # Vérifie si le fichier existe déjà
        self.cursor.execute("SELECT * FROM files WHERE name=? AND parent=? AND owner=?", (filename, self.current_directory, self.userid))
        file_exists = self.cursor.fetchone()
        
        if file_exists:
            return f"File {filename} already exists"
        
        # Crée le fichier dans la base de données
        self.cursor.execute("INSERT INTO files (name, type, content, parent, owner) VALUES (?, ?, ?, ?, ?)", 
                            (filename, 'file', '', self.current_directory, self.userid))
        self.conn.commit()
        return f"File {filename} created"
    
    def mkdir(self, directory):
        """
        Crée un dossier
        """
        # Vérifie si le dossier existe déjà
        self.cursor.execute("SELECT * FROM files WHERE name=? AND parent=? AND owner=?", (directory, self.current_directory, self.userid))
        dir_exists = self.cursor.fetchone()
        
        if dir_exists:
            return f"Directory {directory} already exists"
        
        # Crée le dossier dans la base de données
        self.cursor.execute("INSERT INTO files (name, type, content, parent, owner) VALUES (?, ?, ?, ?, ?)", 
                            (directory, 'directory', '', self.current_directory, self.userid))
        self.conn.commit()
        return f"Directory {directory} created"
    
    def rm(self, filename):
        """
        Supprime un fichier
        """
        if filename == "*":
            self.cursor.execute("DELETE FROM files WHERE parent=? AND owner=? AND type='file'", (self.current_directory, self.userid))
            self.conn.commit()
            return f"All files deleted"
        
        # Vérifie si le fichier existe et est de type 'file'
        self.cursor.execute("SELECT * FROM files WHERE name=? AND parent=? AND owner=? AND type='file'", (filename, self.current_directory, self.userid))
        file_exists = self.cursor.fetchone()
        
        if not file_exists:
            return f"File {filename} not found"
        
        # Supprime le fichier de la base de données
        self.cursor.execute("DELETE FROM files WHERE name=? AND parent=? AND owner=? AND type='file'", (filename, self.current_directory, self.userid))
        self.conn.commit()
        return f"File {filename} deleted"
    
    def rmdir(self, directory):
        """
        Supprime un dossier et tout son contenu
        """
        if directory == "*":
            self.cursor.execute("DELETE FROM files WHERE parent=? AND owner=? AND type='directory'", (self.current_directory, self.userid))
            self.conn.commit()
            return f"All directories deleted"
        
        # Vérifie si le dossier existe et est de type 'directory'
        self.cursor.execute("SELECT * FROM files WHERE name=? AND parent=? AND owner=? AND type='directory'", (directory, self.current_directory, self.userid))
        dir_exists = self.cursor.fetchone()
        
        if not dir_exists:
            return f"Directory {directory} not found"
        
        # Supprime récursivement tous les fichiers et dossiers contenus dans le dossier
        self._delete_directory_contents(directory)
        
        # Supprime le dossier de la base de données
        self.cursor.execute("DELETE FROM files WHERE name=? AND parent=? AND owner=? AND type='directory'", (directory, self.current_directory, self.userid))
        self.conn.commit()
        return f"Directory {directory} and all its contents deleted"

    def _delete_directory_contents(self, directory):
        """
        Supprime récursivement tous les fichiers et dossiers contenus dans un dossier
        """
        self.cursor.execute("SELECT name, type FROM files WHERE parent=? AND owner=?", (self.current_directory + directory , self.userid))
        contents = self.cursor.fetchall()
        for name, type_ in contents:
            if type_ == 'file':
                self.cursor.execute("DELETE FROM files WHERE name=? AND parent=? AND owner=? AND type='file'", (name, self.current_directory + directory , self.userid))
            elif type_ == 'directory':
                self._delete_directory_contents(directory + "/" + name)
                self.cursor.execute("DELETE FROM files WHERE name=? AND parent=? AND owner=? AND type='directory'", (name, self.current_directory + directory , self.userid))
        
        self.conn.commit()
    
    def cat(self, *args):
        """
        Affiche le contenu d'un fichier
        """
        tab=list(args)
    
        if len(tab) == 0:
            return "No file given"
        
        if len(tab)==1:
            filename = tab[0]
            # Vérifie si le fichier existe et est de type 'file'
            self.cursor.execute("SELECT * FROM files WHERE name=? AND parent=? AND owner=? AND type='file'", (filename, self.current_directory, self.userid))
            file_exists = self.cursor.fetchone()

            if not file_exists:
                return f"File {filename} not found"
            
            # Récupère le contenu du fichier
            self.cursor.execute("SELECT content FROM files WHERE name=? AND parent=? AND owner=? AND type='file'", (filename, self.current_directory, self.userid))
            content = self.cursor.fetchone()[0]
            return content
        if '>' in tab:
            #on ajoute le contenu avant le > dans le fichier après le >
            filename = tab[tab.index('>')+1]
            content = " ".join(tab[:tab.index('>')])
            # Vérifie si le fichier existe et est de type 'file'
            self.cursor.execute("SELECT * FROM files WHERE name=? AND parent=? AND owner=? AND type='file'", (filename, self.current_directory, self.userid))
            file_exists = self.cursor.fetchone()

            if not file_exists:
                return f"File {filename} not found"
            
            # Récupère le contenu du fichier
            self.cursor.execute("SELECT content FROM files WHERE name=? AND parent=? AND owner=? AND type='file'", (filename, self.current_directory, self.userid))
            old_content = self.cursor.fetchone()[0]
            new_content = content
            self.cursor.execute("UPDATE files SET content=? WHERE name=? AND parent=? AND owner=? AND type='file'", (new_content, filename, self.current_directory, self.userid))
            self.conn.commit()
            return f"Content added to {filename}"

        return f"Content of {filename}"
    
    def history(self):
        """
        Retourne l'historique des commandes
        """
        return self.history_tab

    def help(self, *args):
        """
        Retourne la liste des commandes disponibles
        """
        if(len(args)==0):
            return "Available commands: help, ls, pwd, cd, history, touch, mkdir, rm, rmdir, cat"
        if(args[0]=="ls"):
            return "ls: list directory contents\n-l: use a long listing format"
        if(args[0]=="pwd"):
            return "pwd: print name of current/working directory"
        if(args[0]=="cd"):
            return "cd: change the shell working directory\n..: move to the parent directory"
        if(args[0]=="touch"):
            return "touch: create a file"
        if(args[0]=="mkdir"):
            return "mkdir: create a directory"
        if(args[0]=="rm"):
            return "rm: remove files or directories\n*: remove all files"
        if(args[0]=="rmdir"):
            return "rmdir: remove empty directories\n*: remove all directories"
        if(args[0]=="cat"):
            return "cat: concatenate files and print on the standard output\n>: add content to a file"
        if(args[0]=="history"):
            return "history: display the command history"
        

        return "Available commands: help, ls, pwd, cd, history, touch, mkdir, rm, rmdir, cat"
    
    def interpreter(self, command,current_directory="/" , userid="0"):
        """
        Interprète la commande donnée en argument
        """
        self.history_tab.append(command)
        self.historyAdd()
        
        self.current_directory = current_directory

        self.userid = userid
        split_command = command.split()
        if len(split_command) == 0:
            return "No command given"
        
        for i in range(len(self.fction)):
            if split_command[0] == self.fction[i].__name__:
                print("fction[i]", self.fction[i].__name__)
                return self.fction[i](*split_command[1:])
        return "Command not found"


