import json
import random
import requests
from bs4 import BeautifulSoup
import os
import time

from faker import Faker

base_url = "http://13.212.85.228:8080"
# base_url = "http://localhost:8080"
simple_password = "123456"

club_data = {
    "data": [{
        "clubid": "rmitmassmedia",
        "name": "RMIT MASS MEDIA CLUB",
        "desc": "Mass Media is the first media club of RMIT SGS Campus. We did everything in the name of creativity that related to media. Come with Mass, our most important requirements are your wild heart and a soul that always craving for more. TOGETHER WE ARE MASSIVES",
        "president": "admin",
        "ava": "./Images/populator_img/mass_media.jpeg",
        "background": "./Images/populator_img/mass_media.jpeg",
    }, {
        "clubid": "rmitfintechclub",
        "name": "RMIT Vietnam FinTech Club",
        "desc": "RMIT Vietnam FinTech Club was launched with the goal to inspire, educate and increase the exposure of people to FinTech and digital disruption via our workshops, meetups, page contents, conferences, boot camps, and events.",
        "president": "admin",
        "ava": "./Images/populator_img/fin_tech.png",
        "background": "./Images/populator_img/fin_tech_bg.jpeg",
    }, {
        "clubid": "rmitsgsmusicclub",
        "name": "RMIT SGS Music Club",
        "desc": "RMIT SGS Music Club of RMIT University Vietnam (Saigon South campus) Official Page",
        "president": "admin",
        "ava": "./Images/populator_img/music.jpeg",
        "background": "./Images/populator_img/music_bg.jpeg",
    }, {
        "clubid": "rmitanalyticsclub",
        "name": "RMIT Vietnam Analytics Club",
        "desc": "Founded in 2008, Analytics Club aims to aid students as they explore the Business Analytics field.",
        "president": "admin",
        "ava": "./Images/populator_img/analytic.jpeg",
        "background": "./Images/populator_img/analytic_bg.jpeg",
    }, {
        "clubid": "rmit.nct",
        "name": "RMIT Neo Culture Tech",
        "desc": "RMIT Neo Culture Tech is a community fueled by the passion for technology and innovations.",
        "president": "admin",
        "ava": "./Images/populator_img/neo.jpeg",
        "background": "./Images/populator_img/neo_bg.jpeg",
    }]
}

club_names = ["rmitmassmedia", "rmitfintechclub",
              "rmitsgsmusicclub", "rmitanalyticsclub", "rmit.nct"]


def add_admin():
    user_data = {
        "username": (None, 'admin'),
        "password": (None, 'admin'),
        "email": (None, 's3000000@rmit.edu.vn'),
        "firstName": (None, 'admin'),
        "lastName": (None, 'user'),
        "isAdmin": (None, True),
        'avatar': ('3.jpg', open('./Images/random/3.jpg', 'rb'))
    }

    channam = {
        "username": (None, 'channam'),
        "password": (None, 'admin'),
        "email": (None, 's3000000@rmit.edu.vn'),
        "firstName": (None, 'Chan Nam'),
        "lastName": (None, 'Tran'),
        "isAdmin": (None, True),
        'avatar': ('channam.jpg', open('./Images/random/channam.jpg', 'rb'))
    }

    tuanle = {
        "username": (None, 'tuanle'),
        "password": (None, 'admin'),
        "email": (None, 's3000000@rmit.edu.vn'),
        "firstName": (None, 'Anh Tuan'),
        "lastName": (None, 'Le'),
        "isAdmin": (None, True),
        'avatar': ('tuanle.jpg', open('./Images/random/tuanle.jpg', 'rb'))
    }

    namthai = {
        "username": (None, 'namthai'),
        "password": (None, 'admin'),
        "email": (None, 's3000000@rmit.edu.vn'),
        "firstName": (None, 'Nam Thai'),
        "lastName": (None, 'Tran'),
        "isAdmin": (None, True),
        'avatar': ('namthai.jpg', open('./Images/random/namthai.jpg', 'rb'))
    }
    # print(user_data)
    response0 = requests.post(base_url + "/auth/signup", files=user_data)
    print("\nADMIN 1 RESULT: ")
    print(response0.json())

    response1 = requests.post(base_url + "/auth/signup", files=namthai)
    print("\nADMIN 1 RESULT: ")
    print(response1.json())

    response2 = requests.post(base_url + "/auth/signup", files=tuanle)
    print("\nADMIN 2 RESULT: ")
    print(response2.json())

    response3 = requests.post(base_url + "/auth/signup", files=channam)
    print("\nADMIN 3 RESULT: ")
    print(response3.json())


fake_people = []


def generate_users(count):
    # user_count = 100
    fake = Faker()
    for i in range(count):
        try:
            person = fake.simple_profile()
            first_name = person['name'].split(" ")[0]
            last_name = person['name'].split(" ")[1]

            user_data = {
                "username": (None, person['username']),
                "password": (None, simple_password),
                "email": (None, 's3000000@rmit.edu.vn'),
                "firstName": (None, first_name),
                "lastName": (None, last_name),
                'avatar': ('5.jpg', open('./Images/random/5.jpg', 'rb'))
            }
            fake_people.append({
                "username": person['username'],
                "email": 's3000000@rmit.edu.vn',
                "firstName": first_name,
                "lastName": last_name
            })
            # print(user_data)
            response = requests.post(
                base_url + "/auth/signup", files=user_data)
            print("\n USER RESULT: ")
            print(response.json())
        except:
            print("err")


def addClub():
    for i in club_data['data']:
        each_club_data = {
            "clubid": (None, i['clubid']),
            'name': (None, i['name']),
            'desc': (None, i['desc']),
            'president': (None, i['president']),
            'avatar': (i['ava'].split("/")[-1], open(i['ava'], 'rb')),
            'background': (i['background'].split("/")[-1], open(i['background'], 'rb'))
        }
        print(each_club_data)
        response = requests.post(base_url + "/club", files=each_club_data)
        print("\n CLUB RESULT: ")
        print(response.json())


def addMemberToClub():

    for i in club_names:
        payload = {
            "clubId": i,
            "users": []
        }
        for j in range(15):
            new_mem = random.choice(fake_people)
            if ({
                'username': new_mem['username'],
                'role': 'member'
            } not in payload["users"]):
                payload["users"].append(
                    {
                        'username': new_mem['username'],
                        'role': 'member'
                    })
        print("\n Add member: ")
        print(payload)
        response = requests.post(base_url + "/club/member", json=payload)
        print("NEW MEMBER RESULT")
        print(response.json())


def addEvents(count):
    for i in range(count):
        payload = {'name': f'Dummy events {i}',
                'startDate': '2023-12-14T00:00:00.511Z',
                'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod orci a nulla condimentum, ut tincidunt ante posuere. Etiam nec nisl eget turpis laoreet pharetra eu ut risus. Nam maximus mollis ultrices.',
                'author': 'rmitmassmedia',
                'user': 'admin'}
        files = [
            ('img', ('leaves.jpg',
            open('/Users/nathantran/Downloads/pexels-cátia-matos-1072179.jpg', 'rb'), 'image/jpeg'))
        ]
        headers = {}

        response = requests.request(
            "POST", base_url + "/post/event", headers=headers, data=payload, files=files)

        print(response.text)


if __name__ == "__main__":
    add_admin()
    
    addClub()
    generate_users(30)
    print("done users")
    # time.sleep(2)
    addMemberToClub()
    addEvents(5)
