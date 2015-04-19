describe("Yggdrasil", function () {

  var yggdrasil = require('../Yggdrasil.js');
  var fs = require('fs');



  describe("generate data", function () {

    it("should return 10 items", function () {

      var configuration = {  name: "main",
                             population: 10,
                             options: [  { code: "P", ratio: 80 },
                                         { code: "S", ratio: 20 }  ]
                          };

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 10 );
      expect( items[0].main ).toBeDefined();
      expect( items[0].main == "P" || items[0].main == "S"  ).toBe( true );

    });


    it("field name is product", function () {

      var configuration = {  name: "main",
                             field: "product",
                             population: 1,
                             options: [  { code: "P", ratio: 100 },
                                         { code: "S", ratio: 0 }  ]
                          };

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].product ).toBeDefined();
      expect( items[0].product ).toBe( "P" );

    });


    it("field name is main when no field is given", function () {

      var configuration = {  name: "main",
                             population: 1,
                             options: [  { code: "P", ratio: 100 },
                                         { code: "S", ratio: 0 }  ]
                          };

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].main ).toBeDefined();
      expect( items[0].main ).toBe( "P" );

    });


    it("iterate over sub configurations", function () {

      var subConfigurationP = {  name: "Pdetails",
                                 field: "partp",
                                 options: [  { code: "P1", ratio: 0},
                                             { code: "P2", ratio: 100}  ]
                              };

      var subConfigurationS = {  name: "Sdetails",
                                 field: "parts",
                                 options: [  { code: "S1", ratio: 30},
                                             { code: "S2", ratio: 70}  ]
                              };

      var configuration = {  name: "main",
                             field: "product",
                             population: 1,
                             options: [  { code: "P", ratio: 100, configurations: [ subConfigurationP ] },
                                         { code: "S", ratio: 0, configurations: [ subConfigurationS ]  }  ]
                          };

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].product ).toBeDefined();
      expect( items[0].product ).toBe( "P" );
      expect( items[0].partp ).toBeDefined();
      expect( items[0].partp ).toBe( "P2" );
      expect( items[0].parts ).not.toBeDefined(); //either one or the other

    });


    it("iterate over sub configurations and use same field", function () {

      var subConfigurationP = {  name: "Pdetails",
                                 field: "part",
                                 options: [  { code: "P1", ratio: 0},
                                             { code: "P2", ratio: 100}  ]
                              };

      var subConfigurationS = {  name: "Sdetails",
                                 field: "part",
                                 options: [  { code: "S1", ratio: 30},
                                             { code: "S2", ratio: 70}  ]
                              };

      var configuration = {  name: "main",
                             field: "product",
                             population: 1,
                             options: [  { code: "P", ratio: 100, configurations: [ subConfigurationP ] },
                                         { code: "S", ratio: 0, configurations: [ subConfigurationS ]  }  ]
                          };

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].product ).toBeDefined();
      expect( items[0].product ).toBe( "P" );
      expect( items[0].part ).toBeDefined();
      expect( items[0].part ).toBe( "P2" );

    });

  });
/*
      Math.random = jasmine.createSpy("random() spy").andCallFake(function() {
        return 1;
      });
*/

  // sous configs multiples


});
