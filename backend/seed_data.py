from sqlalchemy.orm import Session
import models
import database
import json

models.Base.metadata.create_all(bind=database.engine)

def seed_database():
    db = Session(database.engine)
    
    try:
        # Clear existing data
        db.query(models.Philosophy).delete()
        db.query(models.Religion).delete()
        db.query(models.AstrologicalSystem).delete()
    
        # Seed Philosophies
        philosophies = [
            {
                "name": "Stoicism",
                "description": "Ancient Greek philosophy focusing on personal ethics, rationality, and living in harmony with nature's laws. It teaches that the path to happiness is found in accepting the present moment as it is.",
                "origin": "Ancient Greece",
                "key_principles": [
                    "Focus on what you can control",
                    "Live in accordance with nature",
                    "Practice self-discipline",
                    "Maintain emotional equilibrium",
                    "Virtue is the only true good"
                ]
            },
            {
                "name": "Taoism",
                "description": "Chinese philosophy and religion emphasizing living in harmony with the Tao (the Way). It promotes simplicity, spontaneity, and harmony with nature.",
                "origin": "Ancient China",
                "key_principles": [
                    "Wu Wei (non-action)",
                    "Balance of Yin and Yang",
                    "Living in harmony with nature",
                    "Simplicity and spontaneity",
                    "The Tao is the source of all being"
                ]
            },
            {
                "name": "Vedanta",
                "description": "One of the six orthodox schools of Hindu philosophy, focusing on the nature of ultimate reality and self-realization.",
                "origin": "Ancient India",
                "key_principles": [
                    "Brahman is the ultimate reality",
                    "Atman is identical with Brahman",
                    "The world is ultimately illusory (Maya)",
                    "Liberation (Moksha) through self-knowledge",
                    "Unity of all existence"
                ]
            }
        ]

        # Seed Religions
        religions = [
            {
                "name": "Hinduism",
                "description": "The world's oldest living religion, emphasizing dharma (moral and social order), karma (action and consequence), and moksha (liberation).",
                "sacred_texts": [
                    "Vedas",
                    "Upanishads",
                    "Bhagavad Gita",
                    "Puranas"
                ],
                "practices": [
                    "Meditation",
                    "Yoga",
                    "Puja (worship)",
                    "Pilgrimage",
                    "Devotional singing"
                ]
            },
            {
                "name": "Buddhism",
                "description": "A path of spiritual development leading to insight into the true nature of reality, founded by Siddhartha Gautama.",
                "sacred_texts": [
                    "Tripitaka",
                    "Dhammapada",
                    "Heart Sutra",
                    "Diamond Sutra"
                ],
                "practices": [
                    "Meditation",
                    "Mindfulness",
                    "Ethical conduct",
                    "Study of dharma",
                    "Chanting"
                ]
            },
            {
                "name": "Sufism",
                "description": "The mystical dimension of Islam, focusing on direct personal experience of the Divine through love and devotion.",
                "sacred_texts": [
                    "Quran",
                    "Masnavi",
                    "Conference of the Birds",
                    "Works of Ibn Arabi"
                ],
                "practices": [
                    "Dhikr (remembrance)",
                    "Sama (spiritual concert)",
                    "Meditation",
                    "Poetry recitation",
                    "Whirling"
                ]
            }
        ]

        # Seed Astrological Systems
        astrological_systems = [
            {
                "name": "Western Astrology",
                "origin": "Ancient Mesopotamia and Greece",
                "description": "A system based on the tropical zodiac and planetary movements, focusing on psychological and predictive aspects.",
                "key_concepts": [
                    "Houses",
                    "Aspects",
                    "Planetary rulerships",
                    "Elements and modalities",
                    "Transit analysis"
                ],
                "zodiac_signs": [
                    "Aries", "Taurus", "Gemini", "Cancer", 
                    "Leo", "Virgo", "Libra", "Scorpio",
                    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
                ]
            },
            {
                "name": "Vedic Astrology (Jyotish)",
                "origin": "Ancient India",
                "description": "Traditional Hindu system of astrology using the sidereal zodiac, focusing on karma and life purpose.",
                "key_concepts": [
                    "Nakshatras (lunar mansions)",
                    "Dashas (planetary periods)",
                    "Yogas (planetary combinations)",
                    "Houses (Bhavas)",
                    "Remedial measures"
                ],
                "zodiac_signs": [
                    "Mesha", "Vrishabha", "Mithuna", "Karka",
                    "Simha", "Kanya", "Tula", "Vrishchika",
                    "Dhanus", "Makara", "Kumbha", "Meena"
                ]
            },
            {
                "name": "Chinese Astrology",
                "origin": "Ancient China",
                "description": "Based on cycles of years, months, and hours, incorporating elements and animal signs.",
                "key_concepts": [
                    "Animal signs",
                    "Five Elements",
                    "Yin and Yang",
                    "Four Pillars",
                    "Lucky elements"
                ],
                "zodiac_signs": [
                    "Rat", "Ox", "Tiger", "Rabbit", 
                    "Dragon", "Snake", "Horse", "Goat",
                    "Monkey", "Rooster", "Dog", "Pig"
                ]
            }
        ]


        # Add to database
        for philosophy in philosophies:
            db_philosophy = models.Philosophy(**philosophy)
            db.add(db_philosophy)

        for religion in religions:
            db_religion = models.Religion(**religion)
            db.add(db_religion)

        for system in astrological_systems:
            db_system = models.AstrologicalSystem(**system)
            db.add(db_system)

        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
    
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()