DROP TABLE IF EXISTS student_exam;
DROP TABLE IF EXISTS student_answers;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
drop table if exists exams;
drop table if exists students;



CREATE TABLE students (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(50) NOT NULL
);

CREATE TABLE exams (
    id     SERIAL PRIMARY KEY,
    name   VARCHAR(100) NOT NULL
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

create table student_exam (
  id          SERIAL PRIMARY KEY,
  student_id     integer references students(id),
   exam_id     integer references exams(id)
);


create table student_answers (
  id          SERIAL PRIMARY KEY,
  student_id     integer references students(id),
   answer_id     integer references answers(id)
);





INSERT INTO students (name) VALUES ('Adam Smith'),('John Dope'),('Carolin Garcia'),('Leila Fernandez');

INSERT INTO exams (name) VALUES ('English');

Insert Into questions (question, image, exam_id) values
    ('What flag is this?', '/images/flag.jpeg', 1),
    ('Her thinking leans ____ democracy?', '/',1),
    ('I ____ never seen such a picture before?', '/', 1),
    ('Where is this bridge located?', '/images/city.jpeg', 1),
    ('The doctor gave me a ______ for some medicine yesterday?', '/',1),
    ('He is very good _____ making stories?', '/', 1),
    ('I do my work ______ carefully to avoid making mistakes?', '/',1),
    ('The Chairman is ill and we will have to ______ the meeting for a few days?', '/', 1),
    ('The cat and the dog have a _______ enemy in the rat?', '/', 1),
    ('He told me that he ________ watching the movie?', '/',1);
   
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






