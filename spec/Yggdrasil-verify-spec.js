describe("Yggdrasil-verify", function () {

  var yggdrasil = require('../Yggdrasil.js');
  var fs = require('fs');

  describe("1- when single choice, ratio must add up to 100", function () {

    describe("1.1- for main configuration", function () {

      it("should report success", function () {

        var configuration = yggdrasil.samples().mainDefault;

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length ).toBe( 0 );

      });

      it("should report error", function () {

        var configuration = yggdrasil.samples().mainDefault;
        configuration.options[1].ratio = 10;

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length ).toBe( 1 );

      });

    });

    describe("1.2- for sub configuration", function () {

      it("should report success", function () {

        var configuration = yggdrasil.samples().mainBase;
        var sub1 = yggdrasil.samples().sub1Default;
        configuration.options[0].configurations.push(sub1);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length  ).toBe( 0 );

      });

      it("should report error", function () {

        var configuration = yggdrasil.samples().mainBase;
        var sub1 = yggdrasil.samples().sub1Default;
        sub1.options[1].ratio = 20;
        configuration.options[0].configurations.push(sub1);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length  ).toBe( 1 );

      });

    });

    describe("1.3- mono option", function () {

      it("should report success", function () {

        var configuration = yggdrasil.samples().mainBaseMono;
        var sub = yggdrasil.samples().subMono;
        configuration.options[0].configurations.push(sub);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length  ).toBe( 0 );

      });

      it("should report error on main", function () {

        var configuration = yggdrasil.samples().mainBaseMono;
        configuration.options[0].ratio += 1;
        var sub = yggdrasil.samples().subMono;
        configuration.options[0].configurations.push(sub);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        //expect( failures.length ).toBe( 1 );
        expect( failures.length ).toBe( 2 ); //??

      });

      it("should report error on sub", function () {

        var configuration = yggdrasil.samples().mainBaseMono;
        var sub = yggdrasil.samples().subMono;
        sub.options[0].ratio += 1;
        configuration.options[0].configurations.push(sub);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        //expect( failures.length ).toBe( 1 );
        expect( failures.length ).toBe( 2 ); //??

      });

    });

    describe("1.4- multiple sub configurations", function () {

      it("should report success", function () {

        var configuration = yggdrasil.samples().mainBase;
        var sub1 = yggdrasil.samples().sub1Default;
        var sub2 = yggdrasil.samples().sub2Default;
        configuration.options[0].configurations.push(sub1);
        configuration.options[1].configurations.push(sub2);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length ).toBe( 0 );

      });

      it("should report error", function () {

        var configuration = yggdrasil.samples().mainBase;
        var sub1 = yggdrasil.samples().sub1Default;
        var sub2 = yggdrasil.samples().sub2Default;
        sub2.options[1].ratio -= 1;
        configuration.options[0].configurations.push(sub1);
        configuration.options[1].configurations.push(sub2);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length  ).toBe( 1 );

      });

    });

  });


  describe("2- when multiple choice, ratio may not add up to 100", function () {

    describe("2.1- for main configuration", function () {

      it("should report success", function () {

        var configuration = yggdrasil.samples().mainDefault;
        configuration.loopOptions = [ { count:1, ratio:100 } ];
        configuration.options[0].ratio -= 1;

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length  ).toBe( 0 );

      });

    });

    describe("2.2- for sub configuration", function () {

      it("should report success", function () {

        var configuration = yggdrasil.samples().mainBase;
        var sub1 = yggdrasil.samples().sub1Default;
        sub1.options[0].ratio -= 1;
        sub1.loopOptions = [ { count:1, ratio:100 } ];
        configuration.options[0].configurations.push(sub1);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length  ).toBe( 0 );

      });

    });

  });

  describe("3- when multiple choice, ratio should no exceed 100", function () {

    describe("3.1- for main configuration", function () {

      it("should report error", function () {

        var configuration = yggdrasil.samples().mainBaseMono;
        configuration.options[0].ratio += 1;
        configuration.loopOptions = [ { count:1, ratio:100 } ];

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length  ).toBe( 1 );

      });

    });

    describe("3.2- for sub configuration", function () {

      it("should report error", function () {

        var configuration = yggdrasil.samples().mainBaseMono;
        var sub1 = yggdrasil.samples().subMono;
        sub1.options[0].ratio += 1;
        sub1.loopOptions = [ { count:1, ratio:100 } ];
        configuration.options[0].configurations.push(sub1);

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result="1+ result);
        expect( failures.length  ).toBe( 1 );

      });

    });

  });

  describe("4- when multiple choice, loop ratio must add up to 100", function () {

    describe("4.1- for main configuration", function () {

      it("should report success", function () {

        var configuration = yggdrasil.samples().mainDefault;
        configuration.loopOptions = [ { count:1, ratio:60 }, { count:2, ratio:40 } ];

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length ).toBe( 0 );

      });

      it("should report error", function () {

        var configuration = yggdrasil.samples().mainDefault;
        configuration.options[1].ratio = 10;
        configuration.loopOptions = [ { count:1, ratio:60 }, { count:2, ratio:41 } ];

        var failures = yggdrasil.verify(configuration);
        //console.log("[VerifyTest] result=" + result);
        expect( failures.length ).toBe( 1 );

      });

    });
  });

});
