//just some simple examples: not related to any components or services

import {fakeAsync, flush, flushMicrotasks, tick} from '@angular/core/testing';
import set = Reflect.set;
import {delay} from 'rxjs/operators';
import {of} from 'rxjs';

fdescribe('Async Testing Examples', () => {

  it('Asynchronous test example with Jasmine done()', (done) => {
    let test = false;
    setTimeout(() => {
      console.log('running assertion setTimeout');
      test = true;
      expect(test).toBeTruthy();
      done();
    },1000);
  //   expect(test).toBeTruthy(); don't work
  });

  it('Asynchronous test example with setTimeout()', fakeAsync(() => {
    let test = false;
    setTimeout(() => {
        console.log('running assertion setTimeout');
        test = true;
        //expect(test).toBeTruthy();
      },1000);
    tick(1000);
    expect(test).toBeTruthy(); //can work here, but in the above 1st test don't work.
  }));


  it('Asynchronous test example with multiple setTimeout()', fakeAsync(() => {
    //Micro tasks has priority (Promises) then the Macro tasks (setTimeout(), ajaxcalls, setInterval, mouseClick,...)
    let test = false;
    setTimeout(() => {});
    setTimeout(() => {
      console.log('running assertion setTimeout');
      test = true;
    },1000);
    flush();
    expect(test).toBeTruthy(); //can work here, but in the above 1st test don't work.
  }));

  //check the order (Micro tasks first then Macro taks:
  // fit('Asynchronous test example - promises (Micro) and setTimeout (Macro) tasks', () => {
  //   let test = false;
  //   console.log('Creating promise');
  //   setTimeout(() => {
  //     console.log('setTimeout() first call back triggered');
  //   });
  //
  //   setTimeout(() => {
  //     console.log('setTimeout() second call back triggered');
  //   });
  //  Promise.resolve().then(() => {
  //    console.log('promise first then() evaluated successfully');
  //    return Promise.resolve();
  //  }).then(() => {
  //    console.log('promise second then() evaluated successfully');
  //    test = true;
  //  });
  //
  //  console.log('Running test assertion');
  //  expect(test).toBeTruthy();
  // });



  it('Asynchronous test example - plain promises (Micro)', fakeAsync(() => {
    let test = false;
    console.log('Creating promise');
    Promise.resolve().then(() => {
      console.log('promise first then() evaluated successfully');
      return Promise.resolve();
    }).then(() => {
      console.log('promise second then() evaluated successfully');
      test = true;
    });
    flushMicrotasks(); // let the assertions run after the promises complete (only for Microtasks -> promises)
    console.log('Running test assertion');
    expect(test).toBeTruthy();
  }));


  it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
    let counter = 0;
    Promise.resolve()
      .then(() => {
        counter += 10;
        setTimeout(() => {
          counter += 1;
        }, 1000);
      });

    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500) // total 500 + 500 = 1000 ms;
    expect(counter).toBe(11);
  }));


  it('Asynchronous test - Observable', fakeAsync(() => {
    let test = false;
    console.log('Creating Observable');
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
      test = true;
    });
    tick(1000); //because delay use setTimeout internally
    console.log('Running test assertions');
    expect(test).toBeTruthy();
  }));

});
