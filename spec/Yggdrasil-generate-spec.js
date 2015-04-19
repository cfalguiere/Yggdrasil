describe("Yggdrasil-generate", function () {

  var yggdrasil = require('../Yggdrasil.js');
  var fs = require('fs');



  beforeEach(function() {
    Math.random = jasmine.createSpy("random() spy").andCallFake(function() {
      console.log("been here");
      return 0.5;
    });

  });


  describe("1- number of items should match population", function () {

    it("should return 10 items", function () {

      var configuration = yggdrasil.samples().mainDefault;

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 10 );
      expect( items[0].main ).toBeDefined();
      expect( items[0].main == "A" || items[0].main == "B"  ).toBe( true );

    });

  });

  describe("2- write value onto a field which name is the value of field", function () {

    beforeEach(function() {
        yggdrasil.pick = jasmine.createSpy("pick() spy").andCallFake(function() {
          console.log("been here");
          return "AAA";
        });

    });


    it("field name is product", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      configuration.population = 1;
      configuration.field = "product";

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items[0].product ).toBeDefined();
      expect( items[0].product ).toBe( "O" );

    });


    it("field name is main when no field is given", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      configuration.population = 1;

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].main ).toBeDefined();
      expect( items[0].main ).toBe( "O" );

    });


    it("iterate over sub configurations", function () {

      var configuration = yggdrasil.samples().mainBase;
      configuration.population = 1;
      configuration.field = "product";
      var sub1 = {  name: "sub1", options: [  { code: "A1", ratio: 100} ] };
      var sub2 = {  name: "sub1", options: [  { code: "A2", ratio: 100} ] };
      configuration.options[0].configurations.push(sub1);
      configuration.options[1].configurations.push(sub2);

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].product ).toBeDefined();
      expect( items[0].product ).toBe( "A" );
      expect( items[0].sub1 ).toBeDefined();
      expect( items[0].sub1 ).toBe( "A1" );
      expect( items[0].sub2 ).not.toBeDefined(); //either one or the other

    });


    it("iterate over sub configurations and use same field", function () {

      var configuration = yggdrasil.samples().mainBase;
      configuration.population = 1;
      configuration.field = "product";
      var sub1 = {  name: "sub1", field: "part", options: [  { code: "A1", ratio: 100} ] };
      var sub2 = {  name: "sub1", field: "part", options: [  { code: "A2", ratio: 100} ] };
      configuration.options[0].configurations.push(sub1);
      configuration.options[1].configurations.push(sub2);

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].product ).toBeDefined();
      expect( items[0].product ).toBe( "A" );
      expect( items[0].part ).toBeDefined();
      expect( items[0].part == "A1" || items[0].part == "A2" ).toBe( true);

    });

    it("works with only one item", function () {

        var configuration = yggdrasil.samples().mainBaseMono;
        var sub1 = yggdrasil.samples().subMono;
        configuration.options[0].configurations.push(sub1);
        configuration.population = 1;

        yggdrasil.prepare( configuration );
        var items = yggdrasil.generate( configuration );

        expect( items.length ).toBe( 1 );
        expect( items[0].main ).toBe( "O" );
        expect( items[0].subMono ).toBe( "OO" );
    });

    it("works with multiple sub configurations", function () {

        var configuration = yggdrasil.samples().mainBaseMono;
        var sub1 = {  name: "sub1", options: [  { code: "OO1", ratio: 100} ] };
        var sub2 = {  name: "sub2", options: [  { code: "OO2", ratio: 100} ] };
        configuration.options[0].configurations.push(sub1);
        configuration.options[0].configurations.push(sub2);
        configuration.population = 1;

        yggdrasil.prepare( configuration );
        var items = yggdrasil.generate( configuration );

        expect( items.length ).toBe( 1 );
        expect( items[0].main ).toBe( "O" );
        expect( items[0].sub1 ).toBe( "OO1" );
        expect( items[0].sub2 ).toBe( "OO2" );
    });

  });


  describe("5- generate a list according to loopOptions", function () {

    it("should yield 1 item when count is 1", function () {
      var configuration = yggdrasil.samples().mainBaseMono;
      var sub1 = {  name: "sub1",
                    loopOptions: [ { count: 1, ratio: 100 }],
                    options: [ { code: "OO1", ratio: 100 } ] };
      configuration.options[0].configurations.push(sub1);
      configuration.population = 1;

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].main ).toBe( "O" );
      expect( items[0].sub1 ).toEqual( ["OO1"] );
    });

    it("should yield 2 items when count is 2", function () {
      var configuration = yggdrasil.samples().mainBaseMono;
      var sub1 = {  name: "sub1",
                    loopOptions: [ { count: 2, ratio: 100 } ],
                    options: [ { code: "OO1", ratio: 100 }, { code: "OO2", ratio: 80 } ] };
      configuration.options[0].configurations.push(sub1);
      configuration.population = 1;

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      expect( items.length ).toBe( 1 );
      expect( items[0].main ).toBe( "O" );
      expect( items[0].sub1 ).toEqual( ["OO1", "OO2"] );
    });

  });

  //TODO check that the number of options is greater than the maximum count. Otherwise exclude fails

});
