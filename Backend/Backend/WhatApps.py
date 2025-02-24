import sqlite3
import time
class WhatApps:
    def __init__(self):
        self.conn = sqlite3.connect('WhatAppDB.db')
        self.cursor = self.conn.cursor()
        self.cursor.execute(''' CREATE TABLE IF NOT EXISTS WhatAppDB (user1 TEXT, user2 TEXT, message TEXT, time TEXT, whosend TEXT)''')
        self.conn.commit()
        self.user1=0
        self.user2=0
        self.message=""
        self.time=time.time()
        self.whosend=0

    def insert(self, user1, user2, message, whosend):#Fonction qui permet d'insérer un message dans la base de données
        #Le user1 est toujours celui qui a un numero plus petit
        user2=user2[0]
        if user1 > user2:
            user1, user2 = user2, user1
        self.user1 = user1
        self.user2 = user2
        self.message = message
        self.time = time.time()
        self.whosend = whosend

        #verifie si les id de user1, user2 et whosend existent dans la base de donnée 
        
        #TODO

        #Insertion des données dans la base de donnée
        self.cursor.execute('''INSERT INTO WhatAppDB (user1, user2, message, time, whosend) VALUES (?, ?, ?, ?, ?)''', (self.user1, self.user2, self.message, self.time, self.whosend))
        self.conn.commit()

    def get(self, user1, user2): # Renvoie les messages entre user1 et user2

        #Le user1 est toujours celui qui a un numero plus petit
        
        if user1 > user2:
            user1, user2 = user2, user1
        self.user1 = user1
        self.user2 = user2

        #Recuperation des messages
        self.cursor.execute('''SELECT * FROM WhatAppDB WHERE user1 = ? AND user2 = ?''', (self.user1, self.user2))
        messages = self.cursor.fetchall()
        print(messages)
        return messages
    
    def getConversation(self, user1):#Renvoie les users avec qui user1 a eu une conversation
        #Renvoie le nombre de conversation le user a 
        
        self.cursor.execute('''SELECT DISTINCT user2 FROM WhatAppDB WHERE user1 = ?''', (user1,))
        conversations = self.cursor.fetchall()

        self.cursor.execute('''SELECT DISTINCT user1 FROM WhatAppDB WHERE user2 = ?''', (user1,))
        conversations2 = self.cursor.fetchall()
        for conversation in conversations2:
            if conversation not in conversations:
                conversations.append(conversation)
                
        print(conversations)

        return conversations # Renvoie les users avec qui user1 a eu une conversation
    

        

    
