describe("Yggdrasil-id", function () {

  var yggdrasil = require('../Yggdrasil.js');
  var fs = require('fs');



  beforeEach(function() {

  });


  describe("1- sequential id ", function () {

    describe("1.1 - defaults ", function () {
      it("should return 0 1 2  ... 9", function () {

        var configuration = yggdrasil.samples().mainDefault;
        configuration.ids = [ { field: "id11",  mode: "sequence" } ];

        yggdrasil.prepare( configuration );

        var items = yggdrasil.generate( configuration );

        expect( items.length ).toBe( 10 );
        expect( items[0].id11  ).toBe( 0 );
        expect( items[1].id11  ).toBe( 1 );
        expect( items[2].id11  ).toBe( 2 );

      });
    });

    describe("1.2- with base ", function () {

      it("should return 1 2 3 ... 10", function () {

        var configuration = yggdrasil.samples().mainDefault;
        configuration.ids = [ { field: "id12",  mode: "sequence", base: 1 } ];

        yggdrasil.prepare( configuration );
        var items = yggdrasil.generate( configuration );

        expect( items.length ).toBe( 10 );
        expect( items[0].id12  ).toBe( 1 );
        expect( items[1].id12 ).toBe( 2 );

      });

    });

    describe("1.3- with length ", function () {

      it("should return 001 002 003 ... 010", function () {

        var configuration = yggdrasil.samples().mainDefault;
        configuration.ids = [ { field: "id13",  mode: "sequence", base: 1, length: 3 } ];

        yggdrasil.prepare( configuration );
        var items = yggdrasil.generate( configuration );

        expect( items.length ).toBe( 10 );
        expect( items[0].id13  ).toBe( "001" );
        expect( items[1].id13  ).toBe( "002" );
        expect( items[9].id13  ).toBe( "010" );

      });

    });


    describe("1.4- with prefix ", function () {

      it("should return SC001 SC002 SC003 ... SC010", function () {

        var configuration = yggdrasil.samples().mainDefault;
        configuration.ids = [ { field: "id14",  mode: "sequence", base: 1, length: 3, prefix: "SC" } ];

        yggdrasil.prepare( configuration );
        var items = yggdrasil.generate( configuration );

        expect( items.length ).toBe( 10 );
        expect( items[0].id14  ).toBe( "SC001" );
        expect( items[1].id14  ).toBe( "SC002" );
        expect( items[9].id14  ).toBe( "SC010" );

      });

    });

  });


});
