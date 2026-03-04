import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { fe_request_from_admin } from 'src/app/core/constants/common-constant';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { UserService } from 'src/app/core/services/user.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}




@Component({
  selector: 'app-faq-re-order',
  templateUrl: './faq-re-order.component.html',
  styleUrls: ['./faq-re-order.component.scss']
})
export class FaqReOrderComponent implements OnInit {

  sectionDropdown = new Uiconfig()
  detailedRideList = [];
  cols = [];
  EnumData:any =[]
  sectionData:any =[]
  subscription: Subscription[] = [];
  tableData: any = [];
  faqForm: FormGroup; 
  userDetails = JSON.parse(sessionStorage.getItem('user'));

  
  constructor(private toastr: ToastrService,private fb:FormBuilder,
    public dialogRef: MatDialogRef<FaqReOrderComponent>, 
    private spinner: NgxSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private userServices:UserService) { }

    @ViewChild('table') table: MatTable<any>;
  displayedColumns: string[] = ['position', 'no', 'question', 'answer', 'faqPublishStatusEnumName','questionSequence'];
  // dataSource = ELEMENT_DATA;
  
  displayedColumnsSection: string[] = ['position', 'no', 'sectionName', 'sectionSequence'];

  dropTable(event: CdkDragDrop<any>) {
    console.log(event)
    const prevIndex = this.tableData.findIndex((d) => d === event.item.data);
    moveItemInArray(this.tableData, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  isSection:boolean = false

  ngOnInit(): void {

    console.log(this.data, "paren compnent ")
    if(this.data == 'section') this.isSection=true
      
    else if( this.data == null) this.isSection=false


    
    this.faqForm = this.fb.group ({
      sectionId: ['', []],
    });

    this.sectionDropdown.label = 'Select Section';
    this.sectionDropdown.key = 'sectionId'
    this.sectionDropdown.displayKey = 'sectionName'

    this.getSectionList()

   
   
  }
  closemodel(){
    this.dialogRef.close(FaqReOrderComponent)
  }

  getSectionList(){
    let obj:any={
      id:0
     }
     obj.add = 'get';//fe_action_add;
    obj.req = fe_request_from_admin;
    obj.pageName = 'FaqComponent';
    obj.option = 'Faq section List ReOrder';

    this.subscription.push(
      this.userServices
        .getSectionList(obj)
        .subscribe((res) => {
          if (res.statusCode === 200) {
            this.sectionData = res.data;
            if(this.isSection) this.tableData = [...this.sectionData]
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );

  }


  getFaqTableData(e){
    let obj:any
    
      obj={
        sectionId: e | 0,
        questionId: 0,
        faqPublishStatusEnumId: 0
    }
    
    obj.add = 'get';//fe_action_add;
    obj.req = fe_request_from_admin;
    obj.pageName = 'FaqComponent';
    obj.option = 'Faq Table List'; 

    this.subscription.push(
      this.userServices
        .getFaqTableList(obj)
        .subscribe((res) => {
          if (res.statusCode === 200) {
            this.tableData = res.data
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );
  }


  getTableData(e){
    this.getFaqTableData(e)
  }
  


  SaveNewOrder(){
   let obj :any={}
     if(this.isSection){
      
        let sectionId = this.tableData.map(e=> e.sectionId)
        
         obj=   {
          "loginUserId":Number(this.userDetails.id),
          "sectionsIds":sectionId,
           }

            obj.add = 'Add'
            obj.req = fe_request_from_admin;
            obj.pageName = 'FaqReOrderComponent';
            obj.option = 'FaqReorderSectionAdd';

            this.spinner.show()
      this.subscription.push(
        this.userServices
          .addSectionSequense(obj)
          .subscribe((res) => {
            if (res.statusCode === 200) {
            // this.getFaqTableData(null)
            this.toastr.success(res.message)
            this.spinner.hide()
            this.dialogRef.close(true)
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
     else{
      let qustionId = this.tableData.map(e=> e.questionId)
      obj=   {
        "loginUserId":Number(this.userDetails.id),
        "sectionId":this.faqForm.value.sectionId,
        "questionIds":qustionId
         }
         obj.add = 'Add';//fe_action_add;
         obj.req = fe_request_from_admin;
         obj.pageName = 'FaqReOrderComponent';
         obj.option = 'FaqReorderAdd';


         this.spinner.show()
      this.subscription.push(
        this.userServices
          .addFAQSequence(obj)
          .subscribe((res) => {
            if (res.statusCode === 200) {
            // this.getFaqTableData(null)
            this.toastr.success(res.message)
            this.spinner.hide()
            this.dialogRef.close(true)
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
