// TODO level 3
// TODO check population is not exceeded for small population
// TODO id generator


// ---------
// verify

function verify(configuration) {
  var sum = configuration.options.reduce( function (sum, option) {
    return sum + option.ratio;
  }, 0);


  function configurationReducer(accConfigurations, configuration) {
    return accConfigurations && verify(configuration)
  }

  var accept = (sum <= 100);

  if (configuration.loopOptions) {
      var loopSum = configuration.loopOptions.reduce( function (sum, loopOption) {
        return sum + loopOption.ratio;
      }, 0);
      accept = accept && (loopSum == 100);
  } else {
      accept = accept && (sum == 100);
  }

  accept = configuration.options.reduce( function (accOptions, option) {
    //console.log("[Verify] option=" + JSON.stringify(option));
    var accept = accOptions;
    if (option.configurations) {
         accept = accOptions && option.configurations.reduce( configurationReducer, accOptions);
    }
    return accept
  }, accept);

  //console.log("[Verify] accept=" + accept);

  return accept;
}

function verify2(configuration) {

  var failures = [];

  function configurationReducer(failuresForConfiguration, configuration) {
    return failuresForConfiguration.concat( verify2(configuration) );
  }


  var sum = configuration.options.map( function (option) {
      if (option.ratio > 100) {
        failures.push( "option ratios should not exceed 100" );
      }
      if (option.ratio < 0) {
        failures.push( "option ratios should be between 0 and 100" );
      }
  });

  if (sum > 100) {
    failures.push( "option ratios should not exceed 100" );
  }

  if (configuration.loopOptions) {
      var loopSum = configuration.loopOptions.reduce( function (sum, loopOption) {
        return sum + loopOption.ratio;
      }, 0);
      if (loopSum != 100) {
        failures.push( "loopOption ratios should add up to 100" );
      }

  } else {
      var sum = configuration.options.reduce( function (sum, option) {
        return sum + option.ratio;
      }, 0);
      if (sum != 100) {
        failures.push( "option ratios should add up to 100" );
      }
  }

  failures = configuration.options.reduce( function (failuresForOptions, option) {
    //console.log("[Verify] option=" + JSON.stringify(option));
    if (option.configurations) {
         return option.configurations.reduce( configurationReducer, failuresForOptions );
    }
    return failuresForOptions;
  }, failures);

  //console.log("[Verify] accept=" + accept);
  //console.log("[Verify] failures=" + JSON.stringify(failures));

  return failures;
}

// ---------
// prepare

function computePopulations(options, groupPopulation) {
  options.map( function (option) {
    option.population = groupPopulation * option.ratio / 100; }
  );
}


function computeThresholds(options) {
  options.reduce( function(total, option){
    option.threshold = total + option.ratio;
    return option.threshold;
  }, 0);
}


function prepare(configuration) {
  computePopulations(configuration.options, configuration.population);
  computeThresholds(configuration.options);
  if (configuration.loopOptions) {
    computePopulations(configuration.loopOptions, configuration.population);
    computeThresholds(configuration.loopOptions);
  }

  configuration.options.map( function (option) {
    if ( option.configurations ) {
      option.configurations.map( function (configuration) {
          computePopulations(configuration.options, option.population);
          computeThresholds(configuration.options);
          if (configuration.loopOptions) {
            computePopulations(configuration.loopOptions, option.population);
            computeThresholds(configuration.loopOptions);
          }
      });
    }
  });

}

// ---------
// generate


function pick(options) {
  var option = null;
  var dice = Math.random() * 100;
  //console.log("jet:" + dice);

  var iOption = 0;
  while (option == null) {
    if (dice < options[iOption].threshold) {
      option = options[iOption]
    }
    iOption++;
  }

  return option;
}

function multiplePick(someLoopOptions, someOptions) {

  function pick(options, excludeList) {
    var option = null;
    var dice = Math.random() * 100;
    //console.log("jet:" + dice);

    var iOption = 0;
    while (option == null) {
      var candidate = options[iOption];
      if (dice < candidate.threshold ) {
        if ( excludeList.indexOf(candidate.code) < 0) {
          option = candidate
        }
      }
      iOption++;
    }

    return option;
  }

  var loop = pick(someLoopOptions, []);
  var excludeList = [];
  var selectedOptions = [];
  for (var l=0; l<loop.count; l++) {
    var option  = pick(someOptions, excludeList);
    excludeList.push( option.code );
    selectedOptions.push( option );
  }

  return selectedOptions;
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

var idSequence = 0;
function generateId(configuration) {
  var next = idSequence++;
  if (configuration.base) {
    next += configuration.base;
  }
  if (configuration.length) {
    next = padDigits(next, configuration.length);
  }
  if (configuration.prefix) {
    next = configuration.prefix + next;
  }
  return next;
}

function generate(configuration) {
  var items = [];
  idSequence = 0;

  for (var i=0; i<configuration.population; i++) {
    var item = {};
    var option = pick(configuration.options);
    var fieldName = (configuration.field) ? configuration.field : configuration.name;
    item[fieldName] = option.code;

    if ( option.configurations ) {
      option.configurations.reduce( function (accSubConfiguration, configuration) {
        var selected = null;
        if (configuration.loopOptions) {
          selected = multiplePick(configuration.loopOptions, configuration.options).map( function (option) {
            return option.code;
          });
        } else {
          selected = pick(configuration.options).code;
        }
        var fieldName = (configuration.field) ? configuration.field : configuration.name;
        accSubConfiguration[fieldName] = selected;
        return accSubConfiguration;
      }, item);
    }

    if (configuration.id) {
      item.id = generateId(configuration.id);
    }

    items.push(item);
  }


  return items;
}

// ---------
// check


function check(items, configuration) {
    if (configuration.loopOptions) {
       configuration.loopOptions.map( function (loopOption) {
          var fieldName = (configuration.field) ? configuration.field : configuration.name;
          var group = items.filter( function(c) {
            return c[fieldName].length;
          });
          var count = group.length
          console.log( "[" + configuration.name + "] count:" + loopOption.count + " expected:" + loopOption.population +
                      " yield:"  + count );
       });
    }

   configuration.options.map( function (option) {
      var fieldName = (configuration.field) ? configuration.field : configuration.name;
      var group = items.filter( function(c) {
          if (configuration.loopOptions) {
              return c[fieldName].indexOf(option.code) > -1;
          } else {
              return c[fieldName] == option.code;
          }
      });
      var count = group.length
      console.log( "[" + configuration.name + "] code:" + option.code + " expected:" + option.population +
                  " yield:"  + count );

      if (option.configurations) {
        option.configurations.map( function (configuration) {
          check(group, configuration);
        });
      }

   });

}



// ---------
// samples

function samples() {
  return {
    mainDefault:  {  name: "main",
                     population: 10,
                     options: [  { code: "A", ratio: 80 },
                                 { code: "B", ratio: 20 }  ]
                  },
    mainBase:     {  name: "main",
                     population: 10,
                     options: [  { code: "A", ratio: 80, configurations: [] },
                                 { code: "B", ratio: 20, configurations: [] } ]
                  },
    mainBaseMono: {  name: "main",
                     population: 10,
                     options: [  { code: "O", ratio: 100, configurations: [] } ]
                  },
    sub1Default:  {  name: "sub1",
                     options: [  { code: "S1A", ratio: 70 },
                                 { code: "S1B", ratio: 30 }  ]
                  },
    sub2Default:  {  name: "sub2",
                     options: [  { code: "S2A", ratio: 60 },
                                 { code: "S2B", ratio: 40 }  ]
                  },
    subMono:      {  name: "subMono",
                     options: [  { code: "OO", ratio: 100}  ]
                  }

  };

}



// ---------
// exports

module.exports = {
  verify : verify2,
  prepare : prepare,
  generate : generate,
  check : check,
  samples : samples

};
