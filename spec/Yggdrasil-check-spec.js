describe("Yggdrasil-check", function () {

  var yggdrasil = require('../Yggdrasil.js');
  var fs = require('fs');

  beforeEach(function() {
  });

  describe("1- level 1", function () {

    it("should log a line", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      configuration.population = 2;

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      //console.log( JSON.stringify(items) );

      console.log = jasmine.createSpy("log() spy").andCallFake(function(s) {
        expect( s ).toBe( "[main] code:O expected:2 yield:2" );
      });
      yggdrasil.check( items, configuration );

    });

  });

  describe("2- level 2", function () {

    it("should log 2 lines when 1 sub configuration", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      var sub = yggdrasil.samples().subMono;
      configuration.options[0].configurations.push(sub);
      configuration.population = 2;

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      //console.log( JSON.stringify(items) );

      var logs = [];
      console.log = jasmine.createSpy("log() spy").andCallFake(function(s) {
        logs.push(s);
      });
      yggdrasil.check( items, configuration );

      expect( logs.length ).toBe( 2 );
      expect( logs[0] ).toBe( "[main] code:O expected:2 yield:2" );
      expect( logs[1] ).toBe( "[subMono] code:OO expected:2 yield:2" );

    });

    it("should log 3 lines when 2 sub configurations", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      var sub1 = {  name: "sub1", options: [  { code: "OO1", ratio: 100} ] };
      var sub2 = {  name: "sub2", options: [  { code: "OO2", ratio: 100} ] };
      configuration.options[0].configurations.push(sub1);
      configuration.options[0].configurations.push(sub2);
      configuration.population = 2;


      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      //console.log( JSON.stringify(items) );

      var logs = [];
      console.log = jasmine.createSpy("log() spy").andCallFake(function(s) {
        logs.push(s);
      });
      yggdrasil.check( items, configuration );

      expect( logs.length ).toBe( 3 );
      expect( logs[0] ).toBe( "[main] code:O expected:2 yield:2" );
      expect( logs[1] ).toBe( "[sub1] code:OO1 expected:2 yield:2" );
      expect( logs[2] ).toBe( "[sub2] code:OO2 expected:2 yield:2" );

    });

  });

  describe("3- level 2 and multiple choice", function () {

    it("should log 4 lines, main, count and a line for each options", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      var sub1 = {  name: "sub1",
                    loopOptions: [ { count: 2, ratio: 100 } ],
                    options: [ { code: "OO1", ratio: 100 }, { code: "OO2", ratio: 100 } ] };
      configuration.options[0].configurations.push(sub1);
      configuration.population = 2;

      yggdrasil.prepare( configuration );
      var items = yggdrasil.generate( configuration );

      //console.log( JSON.stringify(items) );

      var logs = [];
      console.log = jasmine.createSpy("log() spy").andCallFake(function(s) {
        logs.push(s);
      });
      yggdrasil.check( items, configuration );

      expect( logs.length ).toBe( 4 );
      expect( logs[0] ).toBe( "[main] code:O expected:2 yield:2" );
      expect( logs[1] ).toBe( "[sub1] count:2 expected:2 yield:2" );
      expect( logs[2] ).toBe( "[sub1] code:OO1 expected:2 yield:2" );
      expect( logs[3] ).toBe( "[sub1] code:OO2 expected:2 yield:2" );

    });

  });

});
