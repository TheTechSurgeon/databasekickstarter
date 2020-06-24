exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
      .then(function() {
          // Inserts seed entries
          return knex('users').insert([{

                  username: 'EliasAdmin1',
                  password: 'ammotek1',
                  email: "test1@gmail.com",
                  role: 'helper',

              },
              {

                  username: 'EliasAdmin2',
                  password: 'ammotek2',
                  email: "test2@gmail.com",
                  role: 'helper',

              },
              {

                  username: 'RobbieUser',
                  password: 'password',
                  email: "test3@gmail.com",
                  role: 'student',
              },
              {

                  username: 'TonyUser',
                  password: 'password2',
                  email: 'test4@gmail.com',
                  role: 'student',
              },
              {

                  username: 'Claudia',
                  password: 'password3',
                  email: 'test5@gmail.com',
                  role: 'student',
              }
          ]);
      });
};