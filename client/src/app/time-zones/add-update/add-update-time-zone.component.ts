import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { } from './';
import { TimeZone } from 'app/core/models/time-zone';

@Component({
  selector: 'app-add-update-time-zone',
  templateUrl: './add-update-time-zone.component.html',
  styles: [`
    label {
      font-size: 12px;
      margin-bottom: 3px;
    }
    input {
      line-height: .1em;
      font-size: 10px;
    }
    select {
      height: 2em !important;
      font-size: 10px !important;
    }
    .form-group {
      margin-bottom: 4px;
    }
  `]
})
export class AddUpdateTimeZoneComponent implements OnInit {

  timeZone: TimeZone | null;
  modalTitle: string;
  loading: boolean;
  submitted = false;
  success = false;

  model: any = {};

  @Input('title') title: string;
  @Output('timeZoneSave') public timeZoneSave: EventEmitter<TimeZone> = new EventEmitter();

  @ViewChild('f') form: NgForm;

  constructor() {}

  ngOnInit() {
    this.resetForm();
  }

  save(value: any) {
    if (this.model.offsetHours > 12 || this.model.offsetHours < 0) {
      value.form.controls.offsetHours.setErrors('range error');
    } else if (this.model.offsetMinutes > 59 || this.model.offsetMinutes < 0) {
      value.form.controls.offsetMinutes.setErrors('range error');
    }else {
      const newTimeZone = {
        id: !!this.timeZone ? this.timeZone.id : null,
        positiveOffset: this.model.positiveOffset,
        offsetHours: this.model.offsetHours,
        offsetMinutes: this.model.offsetMinutes,
        cityName: this.model.cityName,
        timeZoneName: this.model.timeZoneName
      };
      this.submitted = true;
      this.timeZoneSave.emit(newTimeZone);
    }
  }

  public setTimeZone(timeZone: TimeZone) {
    this.resetForm(timeZone);
    this.timeZone = timeZone;
  }

  public resetForm(timeZone: TimeZone | null = null) {
    this.timeZone = timeZone;
    this.loading = false;
    this.submitted = false;
    this.success = false;
    this.form.reset();
    if (!!timeZone) {
      this.prepopulateForm(timeZone);
    } else {
      this.clearModel();
    }
  }

  private prepopulateForm(timeZone: TimeZone ) {
    this.model = {};
    this.model.positiveOffset = timeZone.positiveOffset;
    this.model.offsetHours = timeZone.offsetHours;
    this.model.offsetMinutes = timeZone.offsetMinutes;
    this.model.cityName = timeZone.cityName;
    this.model.timeZoneName = timeZone.timeZoneName;
  }

  private clearModel() {
    this.model = {};
    this.model.positiveOffset = null;
    this.model.offsetHours = null;
    this.model.offsetMinutes = 0;
    this.model.cityName = null;
    this.model.timeZoneName = null;
  }

  public setSuccess(success: boolean) {
    this.success = success;
  }
}
