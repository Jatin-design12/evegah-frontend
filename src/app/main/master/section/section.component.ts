import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { EDIT, FAQ, Publish, PublishEnumId, UnublishEnumId, fe_request_from_admin } from 'src/app/core/constants/common-constant';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { ReportService } from 'src/app/core/services/report/report.service';
import { UserService } from 'src/app/core/services/user.service';
import { FaqReOrderComponent } from 'src/app/shared/components/faq-re-order/faq-re-order.component';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit  {
  faqForm: FormGroup; 
  heading: string ; 
  rideStarDropdown = new Uiconfig();
  StatusDropdown =new Uiconfig();
  sectionDropdown = new Uiconfig()
  detailedRideList = [];
  cols = [];
  EnumData:any =[]
  sectionData:any =[]
  subscription: Subscription[] = [];
  tableData: any = [];
  buttonLabel:any= 'Save'
  userDetails = JSON.parse(sessionStorage.getItem('user'));

  constructor(public formBuilder: FormBuilder,
    private reportService: ReportService,
    private userServices:UserService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private dailogRef: MatDialog,
    ) { }

  ngOnInit(): void {
    // this.getEnumList()
    this.getSectionList()

    this.faqForm = this.formBuilder.group ({
      section: ['', [Validators.required]],

    });    
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'sectionName',
        display: 'Section Name',
        sort: true,
      },
      
      // {
      //   key: 'question',
      //   display: 'Question',
      //   sort: true,
      // },
      // {
      //   key: 'answer',
      //   display: 'Answer',
      //   sort: true,
      // },
      // {
      //   key: 'lastPublishDate',
      //   display: 'Last Publish Date',
      //   sort: true,
      //   config: { isDate: true, format: 'dd-MM-yyyy , h:mm:ss a' }, //'dd-MM-yyyy, h:mm:ss a'

      // },
      // {
      //   key: 'lastUnpublishDate',
      //   display: 'Last Unpublish Date',
      //   sort: true,
      //   config: { isDate: true, format: 'dd-MM-yyyy , h:mm:ss a' }, //'dd-MM-yyyy, h:mm:ss a'

      // },
      {
        key: 'sectionSequence',
        display: 'Sequence',
        sort: true,
      },
      
      



      // {
      //   key: 'faqPublishStatusEnumName', //'PublishStatus',
      //   display: 'Publish Status',
      //   sort: true,
      // },

      {
        key: 'createdOnDate',
        display: 'Create Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'updatedOnDate',
        display: 'Update Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isAction: true, actions: [EDIT] },
      },
      // {
      //   key: 'bikeProduceIds',
      //   display: '',
      //   sort: false,
      //   config: {
      //     actions: [
      //       Publish,
      //       // ReOrder
      //     ],
      //     isbutton: true,
      //     isClickAble: true,
      //   },
      // },
      
    

    ];
    // this.setDefaultConfig();
    // // this.getEnumList()/
    // this.getFaqTableData(null)
  }
  setDefaultConfig() {
   

    this.StatusDropdown.label = 'Publish Status';
    this.StatusDropdown.key = 'enum_id'
    this.StatusDropdown.displayKey = 'name'

    this.sectionDropdown.label = 'Select Section';
    this.sectionDropdown.key = 'sectionId'
    this.sectionDropdown.displayKey = 'sectionName'

  }

  getEnumList(){
    this.subscription.push(
      this.reportService
        .GetEnumDetails(FAQ)
        .subscribe((res) => {
          if (res.statusCode === 200) {
            this.EnumData = res.data;
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );
  }


  getSectionList(){
    let obj:any={
      id:0
     }
     obj.add = 'get';//fe_action_add;
    obj.req = fe_request_from_admin;
    obj.pageName = 'FaqComponent';
    obj.option = 'Faq section List';

    this.subscription.push(
      this.userServices
        .getSectionList(obj)
        .subscribe((res) => {
          if (res.statusCode === 200) {
            this.tableData = res.data;
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );

  }

  getListBySubmit(){
    this.tableData=[]
    let obj:any=
     {
      "loginUserId":Number(this.userDetails.id),
      "sectionId":0,
      "sectionName":this.faqForm.value.section,
   }
    obj.add = 'Add';//fe_action_add;
    obj.req = fe_request_from_admin;
    obj.pageName = 'SectionComponent';
    obj.option = 'AddSection';
    

    if (this.editData.action === 'edit') {
      console.log(this.editData, "check")
      obj.sectionId = this.editData.data.sectionId
      obj.add = 'update';
      }

    this.spinner.show()
    this.subscription.push(
      this.userServices
        .addEditSectionName(obj)
        .subscribe((res) => {
          if (res.statusCode === 200) {
          this.buttonLabel= 'Save'
          this.faqForm.reset()
          // this.getFaqTableData(obj)
          this.getSectionList()
          // this.toastr.success(res.message)
          this.editData={}
          this.spinner.hide()
          } else {
            this.spinner.hide()
            this.toastr.warning(res.message);
            // this.getFaqTableData(obj)
            this.getSectionList()
          }
        },
        err => this.spinner.hide())
    );
  }

  submit() {
    // this.buttonLabel= "Submit"
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }

    this.getListBySubmit()
  }

  editData:any={}
  onActionHandler(event){
    if (event.action === 'edit') {
      this.editData = event
    this.buttonLabel= "Edit"
      this.faqForm.controls['section'].setValue((event.data.sectionName));
      // this.faqForm.controls['answer'].setValue(event.data.answer);
      // this.faqForm.controls['EnumId'].setValue(Number(event.data.faqPublishStatusEnumId));
      // this.faqForm.controls['sectionId'].setValue(event.data.sectionId);
    }

    else if (event.action === Publish) {

   let obj:any=   {
    questionId:event.data.id
     }
      obj.add = 'Add';//fe_action_add;
      obj.req = fe_request_from_admin;
      obj.pageName = 'FaqComponent';
      obj.option = 'PublishOrUnpublish';

    if(event.data.faqPublishStatusEnumId == PublishEnumId ){
      this.spinner.show()
      this.subscription.push(
        this.userServices
          .UnpublishFaq(obj)
          .subscribe((res) => {
            if (res.statusCode === 200) {
            // this.getFaqTableData(null)
            this.getSectionList()
            this.toastr.success(res.message)
            this.spinner.hide()
            } else {
              this.spinner.hide()
              // this.toastr.warning(res.message);
            }
          },
          (err)=>{
            this.spinner.hide()
          }
          )
      );
    }
    else if(event.data.faqPublishStatusEnumId == UnublishEnumId ){
      this.spinner.show()
      this.subscription.push(
        this.userServices
          .publishFaq(obj)
          .subscribe((res) => {
            if (res.statusCode === 200) {
            // this.getFaqTableData(null)
            this.getSectionList()
            this.toastr.success(res.message)
            this.spinner.hide()
            } else {
              this.spinner.hide()
              // this.toastr.warning(res.message);
            }
          },
          (err)=>{
            this.spinner.hide()
          }
          )
      );
    }

      
    }
  }

  // getFaqTableData(e){
  //   let obj:any
  //   if(e !== null){
  //     obj={
  //       sectionId:e.sectionId | 0,
  //       questionId:e.questionId | 0,
  //       faqPublishStatusEnumId:e.faqPublishStatusEnumId | 0
  //     }
  //   }
  //     obj={
  //       sectionId: 0,
  //       questionId: 0,
  //       faqPublishStatusEnumId: 0
  //   }
    
  //   obj.add = 'get';//fe_action_add;
  //   obj.req = fe_request_from_admin;
  //   obj.pageName = 'FaqComponent';
  //   obj.option = 'Faq Table List'; 

  //   this.subscription.push(
  //     this.userServices
  //       .getFaqTableList(obj)
  //       .subscribe((res) => {
  //         if (res.statusCode === 200) {
  //           res.data.forEach(e=>{
  //             e.locationData = true;
  //           })
  //           this.tableData = res.data
  //           this.tableData.sort((a,b)=>
  //             a.questionId - b.questionId
  //           )
  //         } else {
  //           // this.toastr.warning(res.message);
  //         }
  //       })
  //   );
  // }

  checkUpdate($event){
    // this.getFaqTableData(null)
  this.getSectionList()
  }

  ReorderFaq(call){
    // console.log(data)
  let dialogRef=  this.dailogRef.open(FaqReOrderComponent, {
      data: call,
      // { lockId: data.lockId
      //   , lockNumber: data.lockNumber },
      height: '1000px',
      width: '100%',
      panelClass: 'h-100',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`); 
      
      if (result) {
        // this.getFaqTableData(null)
        this.getSectionList()
      } else {
      }
    });
  }

  
}


