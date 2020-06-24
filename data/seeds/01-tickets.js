exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tickets').del()
      .then(function() {
          // Inserts seed entries
          return knex('tickets').insert([{
                  //userid: "",
                  //id: 1,
                  title: 'My mac does not work',
                  description: 'You will figure out what to put when you try it...',
                  tried: "Turning it off and on",
                  category: "laptops"
              },
              {
                  //userid: "",
                  //id: 2,
                  title: 'My windows pc does not work',
                  description: 'You will figure out what to put when you try it...',
                  tried: "Turning it off and on",
                  category: "desktop"
              },
              {
                  //userid: "",
                  //id: 1,
                  title: 'Unable to work with node.js',
                  description: 'You will figure out what to put when you try it...',
                  tried: "Reviewing the TK",
                  category: "NODE JS"
              },
              {
                  //userid: "",
                  //id: 2,
                  title: 'CSS and HTML',
                  description: 'You will figure out what to put when you try it...',
                  tried: "Tried many things",
                  category: "css html"
              },

          ]);
      });
};