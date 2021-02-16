import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';


fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: DebugElement;
  let coursesService: any; // type returned by TestBed
  const beginnerCourses = setupCourses()
    .filter(course => course.category == 'BEGINNER');

  const advancedCourses = setupCourses()
    .filter(course => course.category == 'ADVANCED');

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
      ],
      providers: [
        {provide: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it('should create the component', () => {

    expect(component).toBeTruthy();

  });


  it('should display only beginner courses', () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it('should display only advanced courses', () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it('should display both tabs', () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(2, 'Unexpected number of tabs found');
  });


  // it('should display advanced courses when tab clicked', (done) => {
  //   coursesService.findAllCourses.and.returnValue(of(setupCourses()));
  //   fixture.detectChanges();
  //   const tabs = el.queryAll(By.css('.mat-tab-label'));
  //   click(tabs[1]);//has asynchronous animation frame
  //   fixture.detectChanges();
  //   setTimeout(() => {
  //     //pay attention to .mat-tab-body-active (without it the test will failed)
  //     const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
  //     console.log('card titles: ', cardTitles);
  //     expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
  //     expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  //     done();
  //   }, 500);
  // });

  //improve for the above on using fakeasync instead of done()

  it('should display advanced courses when tab clicked - fakeAsync', fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);//has asynchronous animation frame
    fixture.detectChanges();
    flush();
    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  //Async (waitForAsync) vs fakeAsync
  //in Async you can't use flush, flushMicroTasks, tick
  //you can't right the assertion in a synchrounous way (like outside then(), or outside setTimeout() )
  //waitForAsync give us a callback to notify us that ALL the asynchrounous taks are completed,
  //so you can put all the assertions inside this callback
  //you can't run certain tasks one by one and test intermediate states in component
  //waitForAsync: you can use actual http request, while in fakeAsync you can't
  //that's why we use waitForAsync with beforeEach beacuse it may do some http request to fetch the html,css files
  //check the below example, reformating the above one with waitForAsync instead of fakeAsync
  fit('should display advanced courses when tab clicked - waitForAsync', waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);//has asynchronous animation frame
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      console.log('called whenStable()');
      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });

  }));


});


