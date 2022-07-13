DROP TABLE IF EXISTS student_exams;
DROP TABLE IF EXISTS student_answers;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE if EXISTS exams;
DROP TABLE IF EXISTS difficulty;
DROP TABLE if EXISTS lessons;
DROP TABLE if EXISTS students;

  




CREATE TABLE students (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(50) NOT NULL 
);


Create Table lessons (
	id serial primary key,
	title varchar(200) not null,
	img_url text, 
	intro text,
        summary text, 
        content text,
        video_url text,
	rating int
  );




CREATE TABLE difficulty (
  id       SERIAL PRIMARY KEY,
  type     VARCHAR(10) NOT NULL
);

CREATE TABLE exams (
    id     SERIAL PRIMARY KEY,
    name   VARCHAR(20) NOT NULL,
    lesson_id int references lessons(id),
    difficulty_id int references difficulty(id)
  
);



create table questions (
  id          SERIAL PRIMARY KEY,
  exam_id     integer references exams(id),
  image       varchar(200),
  question    text NOT NULL );

create table answers (
  id                SERIAL PRIMARY KEY,
  question_id       integer references questions(id),
  answer          text NOT NULL,
  is_correct    boolean NOT NULL
);

create table student_exams (
  id          SERIAL PRIMARY KEY,
  student_id     integer references students(id),
   exam_id     integer references exams(id)
);


create table student_answers (
  id          SERIAL PRIMARY KEY,
  student_id     integer references students(id),
   answer_id     integer references answers(id)
);



Insert Into lessons (title, img_url, intro, summary, content, video_url, rating) values 
  ( 'Learn English Like a Baby', 'https://genlish.com/wp-content/uploads/2017/04/English1-1024x690.jpg', 'Do you remember learning your native language? Probably not. That is because as children we pick up language automatically. This video explores how babies learn to speak a language, then lists three ways second language learners can imitate their success.',
    'As the video shows, babies focus more on the stress and the feeling of the words first. This allows them to express and communicate in some way before even learning the proper words',
    'this is the full lesson content 1',
    'https://www.youtube.com/watch?v=QY1Hcm-RtG4',
    23
  ),
  (
     'Auxiliary and Phrasal Verbs',
    
      'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2020/10/ways-to-learn-english-fast.jpg',
    
      'The instructor focuses a lot on the different forms of these verbs. She also talks about when to use contractions and when the verbs are absent in the sentence.',
    
      'The video is extremely useful for beginners as each section is filled with examples where the important words are highlighted in red. While watching the video, be sure to pause when the examples are shown. Notice how the rules are applied and make sure you understand them.',
     'this is the full lesson content 2',
     'https://www.youtube.com/watch?v=A2ncygNMaFo',
     230
  ),
  ('English Pronunciation',
    'https://fluencycorp.com/wp-content/uploads/2019/01/hardest-part-learning-english.jpg',
          'The connection between letters and sounds in English always seems mysterious to beginner English learners. It may seem like the rules of pronunciation are messy, but there are ways to determine what a word sounds like.',
    
      'In this lesson, you will learn about a technique called backchaining that is used by professional actors and language teachers. With backchaining, you pronounce the last sound of a word first and then keep moving forward.',
     'this is the full lesson content 3',
     'https://www.youtube.com/watch?v=sMWLytZAzGg',
     230
  );




INSERT INTO students (name) VALUES ('Adam Smith'),('John Dope'),('Carolin Garcia'),('Leila Fernandez');

INSERT INTO difficulty (type) VALUES ('Easy'),('Medium'), ('Hard');

INSERT INTO exams (name, lesson_id, difficulty_id) VALUES ('English', 1, 1),('English', 1, 2), ('English', 1, 3);

Insert Into questions (question, image, exam_id) values
    ('What flag is this?', '/images/flag.jpeg', 1),
    ('Her thinking leans ____ democracy?', '/',1),
    ('I ____ never seen such a picture before?', '/', 1),
    ('Where is this bridge located?', '/images/city.jpeg', 1),
    ('The doctor gave me a ______ for some medicine yesterday?', '/',2),
    ('He is very good _____ making stories?', '/', 2),
    ('I do my work ______ carefully to avoid making mistakes?', '/',2),
    ('The Chairman is ill and we will have to ______ the meeting for a few days?', '/', 3),
    ('The cat and the dog have a _______ enemy in the rat?', '/', 3),
    ('He told me that he ________ watching the movie?', '/',3);
   
Insert Into answers (answer, is_correct, question_id) values
      ('Italy', false, 1 ),
      ('Sweden',false, 1),
      ('China', false, 1),
      ('United Kingdom',  true,1 ),
      ('with', false, 2),
      ('for',  false,2 ),
      ('in',  false,2 ),
      ('towards', true,2 ),
      ('has',  false, 3 ),
      ('have', true,3 ),
      ('was', false,3 ),
      ('were',  false,3 ),
      ('Manchester',  false,4 ),
      ( 'Leeds',  false,4 ),
      ('London',  true,4 ),
      ( 'Norwich',  false,4 ),
      ('receipt',  false,5 ),
      ('prescription',  true,5 ),
      ('note',  false,5 ),
      ('description',  false,5 ),
      ('in', false, 6 ),
      ('about',false, 6),
      ('at', true, 6),
      ('for',  false,6 ),
      ('so', false, 7),
      ('very',  false,7 ),
      ('too',  true,7 ),
      ('more', false,7 ),
      ('put on',  false, 8 ),
      ('put of', false,8 ),
      ('put away', false,8 ),
      ('put off',  true,8 ),
      ('same',  false,9 ),
      ( 'common',  true,9 ),
      ('mutual',  false,9 ),
      ( 'similar',  false,9 ),
      ('is finished',  false,10 ),
      ('has finished',  false,10 ),
      ('had finished',  true,10 ),
      ('not finished',  false,10 );


INSERT INTO student_exams (student_id, exam_id) VALUES (1,1),(2,1),(3,1),(4,1);

INSERT INTO student_answers (student_id, answer_id) VALUES (1,2),(1,5),(2,3),(2,6),(3,1),(3,5),(4,4),(4,8);







