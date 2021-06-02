import { Component, OnInit } from '@angular/core';
import {ViewChild,Input,NgZone} from '@angular/core'
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit {

  @ViewChild('title') title;
  @ViewChild('des') des;
  @ViewChild('cate') cate;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input()
  formUpload : FormGroup;

  url : string;
  uploaded = false;
  scrollHeightTitle;
  scrollHeightDes;
  dropdownList = [];
  selectedItems = [];
  autocompleteItems = [{display: 'Javascript', value: 'Javascript'}, {display: 'Typescript', value: 'Typescript'}];
  dragAndDropObjects = [{display: 'Javascript', value: 'Javascript'}, {display: 'Typescript', value: 'Typescript'}];
  dropdownSettings :IDropdownSettings;
  title1 = '';
  charCount = 0;
  constructor(private fb : FormBuilder,private _ngZone: NgZone) {
    this.formUpload = this.fb.group({
      title: [''],
      img: [''],
      cates: ['']

    });
    setInterval(() => this.ngOnInit(), 0);
   }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }
  onSelectedFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
      this.uploaded = true;
    }
  }
  onKeyUpTitle() {
    console.log("height", this.scrollHeightTitle);
   this.scrollHeightTitle = this.title?.nativeElement?.scrollHeight;
   console.log("height", this.scrollHeightTitle);
  }
  onKeyUpDes() {
    this.scrollHeightDes = this.des?.nativeElement?.scrollHeight;
  }
  onKeyUpBSTitle(ev) {
    this.charCount = ev?.target?.value?.length;
    // console.warn("len", ev?.target?.value?.length);
    console.warn("backspace1", this.charCount);
    console.warn("backspace", this.charCount % 28 === 0);
    console.warn("backspace", this.charCount % 29 === 0);
    console.warn("backspace", this.charCount %26 === 0);
    console.warn("backspace", this.charCount %27 === 0);

      if (this.charCount % 27 === 0 && this.charCount > 0) {
        console.log("before", this.scrollHeightTitle);
        this.scrollHeightTitle -= 35;
        console.log("after", this.scrollHeightTitle);
      }
    }


  onKeyUpBSDes(type, size) {


    if (type.nativeElement?.value?.length % size === 0 && type.nativeElement?.value?.length > 0) {

      this.scrollHeightTitle -= 30;

    }


}
  onItemSelect(item:any) {}
  onSelectAll(item:any) {}
  public onTagEdited(item) {
    console.log('tag edited: current value is ' + item);
  }
  onValueChange(ev) {

    this.charCount = ev.length;
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
}
