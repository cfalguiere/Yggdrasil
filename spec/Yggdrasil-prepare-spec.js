describe("Yggdrasil-prepare", function () {

  var yggdrasil = require('../Yggdrasil.js');
  var fs = require('fs');


  describe("1- compute population by applying ratio to the parent population", function () {

    it("should add population to each option", function () {

      var configuration = yggdrasil.samples().mainDefault;

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].population ).toBeDefined();
      expect( configuration.options[0].population ).toBe( 8 );
      expect( configuration.options[1].population ).toBeDefined();
      expect( configuration.options[1].population ).toBe( 2 );

    });

    it("should add population to each option when has sub configurations", function () {

      var configuration = yggdrasil.samples().mainBase;
      configuration.population = 100;
      var sub1 = yggdrasil.samples().sub1Default;
      var sub2 = yggdrasil.samples().sub2Default;
      configuration.options[0].configurations.push(sub1);
      configuration.options[1].configurations.push(sub2);

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].population ).toBe( 80 );
      expect( configuration.options[1].population ).toBe( 20 );
      expect( configuration.options[0].configurations[0].options[0].population ).toBe( 56 );
      expect( configuration.options[0].configurations[0].options[1].population ).toBe( 24 );
      expect( configuration.options[1].configurations[0].options[0].population ).toBe( 12 );
      expect( configuration.options[1].configurations[0].options[1].population ).toBe( 8 );

    });

    it("only one option", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      var sub = yggdrasil.samples().subMono;
      configuration.options[0].configurations.push(sub);

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].population ).toBe( 10 );
      expect( configuration.options[0].configurations[0].options[0].population ).toBe( 10 );

    });

    it("multiple sub configurations", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      var sub1 = yggdrasil.samples().subMono;
      var sub2 = yggdrasil.samples().subMono;
      configuration.options[0].configurations.push(sub1);
      configuration.options[0].configurations.push(sub2);

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].population ).toBe( 10 );
      expect( configuration.options[0].configurations[0].options[0].population ).toBe( 10 );
      expect( configuration.options[0].configurations[1].options[0].population ).toBe( 10 );

    });

  });


  describe("2- compute threshold by adding up ratios", function () {

    it("should add threshold to each option", function () {

      var configuration = yggdrasil.samples().mainDefault;

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].threshold ).toBeDefined();
      expect( configuration.options[0].threshold ).toBe( 80 );
      expect( configuration.options[1].threshold ).toBeDefined();
      expect( configuration.options[1].threshold ).toBe( 100 );

    });

    it("should add threshold to each option when has sub configurations", function () {

      var configuration = yggdrasil.samples().mainBase;
      configuration.population = 100;
      var sub1 = yggdrasil.samples().sub1Default;
      var sub2 = yggdrasil.samples().sub2Default;
      configuration.options[0].configurations.push(sub1);
      configuration.options[1].configurations.push(sub2);

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].threshold ).toBe( 80 );
      expect( configuration.options[1].threshold ).toBe( 100 );
      expect( configuration.options[0].configurations[0].options[0].threshold ).toBe( 70 );
      expect( configuration.options[0].configurations[0].options[1].threshold ).toBe( 100 );
      expect( configuration.options[1].configurations[0].options[0].threshold ).toBe( 60 );
      expect( configuration.options[1].configurations[0].options[1].threshold ).toBe( 100 );

    });


    it("only one option", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      var sub = yggdrasil.samples().subMono;
      configuration.options[0].configurations.push(sub);

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].threshold ).toBe( 100 );
      expect( configuration.options[0].configurations[0].options[0].threshold ).toBe( 100 );

    });

    it("multiple configurations", function () {

      var configuration = yggdrasil.samples().mainBaseMono;
      var sub1 = yggdrasil.samples().subMono;
      var sub2 = yggdrasil.samples().subMono;
      configuration.options[0].configurations.push(sub1);
      configuration.options[0].configurations.push(sub2);

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].threshold ).toBe( 100 );
      expect( configuration.options[0].configurations[0].options[0].threshold ).toBe( 100 );
      expect( configuration.options[0].configurations[1].options[0].threshold ).toBe( 100 );

    });


  });

  describe("3- compute population for loops", function () {

    it("should add population to each option", function () {

      var configuration = yggdrasil.samples().mainDefault;
      configuration.loopOptions = [ { count:1, ratio:60 }, { count:2, ratio:40 } ];

      yggdrasil.prepare( configuration );

      expect( configuration.loopOptions[0].population ).toBeDefined();
      expect( configuration.loopOptions[0].population ).toBe( 6 );
      expect( configuration.loopOptions[1].population ).toBeDefined();
      expect( configuration.loopOptions[1].population ).toBe( 4 );

    });

    it("should add population to each option when has sub configurations", function () {

      var configuration = yggdrasil.samples().mainBase;
      configuration.population = 100;
      var sub1 = yggdrasil.samples().sub1Default;
      sub1.loopOptions = [ { count:1, ratio:60 }, { count:2, ratio:40 } ];
      var sub2 = yggdrasil.samples().sub2Default;
      configuration.options[0].configurations.push(sub1);
      configuration.options[1].configurations.push(sub2);

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].configurations[0].loopOptions[0].population ).toBe( 48 );
      expect( configuration.options[0].configurations[0].loopOptions[1].population ).toBe( 32 );

    });
  });

  describe("4- compute threshold for loops", function () {

    it("should add threshold to each option", function () {

      var configuration = yggdrasil.samples().mainDefault;
      configuration.loopOptions = [ { count:1, ratio:60 }, { count:2, ratio:40 } ];

      yggdrasil.prepare( configuration );

      expect( configuration.loopOptions[0].threshold ).toBeDefined();
      expect( configuration.loopOptions[0].threshold ).toBe( 60 );
      expect( configuration.loopOptions[1].threshold ).toBeDefined();
      expect( configuration.loopOptions[1].threshold ).toBe( 100 );

    });

    it("should add threshold to each option when has sub configurations", function () {

      var configuration = yggdrasil.samples().mainBase;
      configuration.population = 100;
      var sub1 = yggdrasil.samples().sub1Default;
      sub1.loopOptions = [ { count:1, ratio:60 }, { count:2, ratio:40 } ];
      var sub2 = yggdrasil.samples().sub2Default;
      configuration.options[0].configurations.push(sub1);
      configuration.options[1].configurations.push(sub2);

      yggdrasil.prepare( configuration );

      expect( configuration.options[0].configurations[0].loopOptions[0].threshold ).toBe( 60 );
      expect( configuration.options[0].configurations[0].loopOptions[1].threshold ).toBe( 100 );

    });
  });

});
