install python
install node.js
intall my sql and create a DB : parkhub_db
clone the repo/ kama ushaclone just pull.
backend: cd parkhub-trial
        python -m venv venv
        venv\Scripts\activate
        pip install -r requirements.txt

note this : f pip install mysqlclient fails, they may need to install "Desktop development with C++" via Visual Studio Build Tools, or download a pre-built wheel file.

initialize the db:
python backend/manage.py migrate
python backend/manage.py seed_data

npm install

npm run dev

note :  always activate the virtual environment with venv\Scripts\activate before running npm run dev


btw everytime you download a new library, for ease of collaboration update the requirements.txt file. by :
pip freeze > requirements.txt
