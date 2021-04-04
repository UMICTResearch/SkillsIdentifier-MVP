import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { JobDataProvider } from '../../providers/job-data/job-data';
import { jobInformation} from '../../assets/data/dataModel';
import { SkillsPage } from '../skills/skills';
import firebase from 'firebase';

import { TranslateService } from '@ngx-translate/core';

const firebaseConfig = {
	apiKey: "AIzaSyAxfa8y78nO9x_mIPkxJpLtzSa7RGt99_o",
	authDomain: "skillsidentifier.firebaseapp.com",
	databaseURL: "https://skillsidentifier.firebaseio.com",
	projectId: "skillsidentifier",
	storageBucket: "skillsidentifier.appspot.com",
	messagingSenderId: "93690322104"
}
// import { ModalHomePage } from '../modal-home/modal-home';

// import { FootbarComponent } from '../../components/footbar/footbar';

@IonicPage({
	name: "home",
	segment: ""
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  lang:any;
	private db: any;
	currentJob = [ {'title': '', 'id': ''},  {'title': '', 'id': ''}, {'title': '', 'id': ''}, {'title': '', 'id': ''}, {'title': '', 'id': ''}, {'title': '', 'id': ''} ];
	dreamJob = {'title': '', 'id': ''};

	infoForm: FormGroup;

	jobAutocompleteList : any[] = [];
	showJobAutocompleteList = -1;


	// currentSelected is used to store the index of the current selected item in the autocomplete list

	currentSelected: number = 0;

	constructor(public navCtrl: NavController,
				public modalCtrl: ModalController,
				private _jobDataProvider: JobDataProvider,
        public translate: TranslateService) {
				try {
          this.lang = 'en';
          this.translate.setDefaultLang('en');
          this.translate.use('en');
					firebase.initializeApp(firebaseConfig);
					this.db = firebase.database();
				}
				catch (err) {
					firebase.app();
					this.db = firebase.database();
				}
	}

  switchLanguage() {
    this.translate.use(this.lang);
  }

	ngOnInit(){
		this.infoForm = new FormGroup({
			currentJobTitleZero: new FormControl('', [Validators.required]),
			currentJobTitleOne: new FormControl('', [Validators.required]),
			currentJobTitleTwo: new FormControl('', [Validators.required]),
			currentJobTitleThree: new FormControl('', [Validators.required]),
			// currentJobTitleFour: new FormControl('', [Validators.required]),
			// currentJobTitleFive: new FormControl('', [Validators.required]),
			dreamJobTitle: new FormControl('', [Validators.required]),
		})

		// this.openModal();

	}

	// openModal(){
	// 	const introModal = this.modalCtrl.create('ModalHomePage')
	// 	introModal.present();
	// }

	pushPage(){

		// this._jobDataProvider.location = this.location;

		// TODO: fix this logic

		this._jobDataProvider.setCurrentJob(this.currentJob);
		this._jobDataProvider.setDreamJob(this.dreamJob);

		this.navCtrl.push("skills")

	}

	// controller of the current job text field -- to deal with arrow keys, enter key, and autocompletion

	async onInputCurrentJob(event: any, i: number){

		if (event.key != "ArrowDown" && event.key != "ArrowUp" && event.key != "Enter")
			if (this.currentJob[i].title.length > 3) {
				this._jobDataProvider.getJobAutocomplete(this.currentJob[i].title, this.translate.currentLang)
				.subscribe(res => {
					this.jobAutocompleteList = res;
					this.currentSelected = 0;
				},
				err => {
					this.jobAutocompleteList = []
				})
			}
			else if (this.currentJob[i].title.length == 0)
				this.jobAutocompleteList = []

		if (event.key == "ArrowDown") {
			this.currentSelected ++;
		}
		else if (event.key == "ArrowUp") {
			this.currentSelected --;
		}
		else if (event.key == "Enter") {
			this.onSelectJobTitle(this.jobAutocompleteList[this.currentSelected], 1)
		}
	}

	async onInputDreamJob(event: any){
		if (event.key != "ArrowDown" && event.key != "ArrowUp" && event.key != "Enter")
			if (this.dreamJob.title.length > 3) {
				this._jobDataProvider.getJobAutocomplete(this.dreamJob.title, this.translate.currentLang)
				.subscribe(res => {
					this.jobAutocompleteList = res;
					this.currentSelected = 0;
				},
				err => {
					this.jobAutocompleteList = []
				})
			}
			else if (this.dreamJob.title.length == 0)
				this.jobAutocompleteList = []

		if (event.key == "ArrowDown" && this.currentSelected < this.jobAutocompleteList.length) {
			this.currentSelected ++;
		}
		else if (event.key == "ArrowUp" && this.currentSelected > 0) {
			this.currentSelected --;
		}
		else if (event.key == "Enter") {
			this.onSelectJobTitle(this.jobAutocompleteList[this.currentSelected], 2)
		}
	}

	async onChangeJobTitle(event: any){
		if (event.value.length > 3) {
			this._jobDataProvider.getJobAutocomplete(event.value, this.translate.currentLang)
			.subscribe(res => {
				this.jobAutocompleteList = res;
			})
		}
		if (event.value.length == 0)
			this.jobAutocompleteList = []
	}

	onHoverJobTitle(index: number){
		this.currentSelected = index;
	}

	// Users select the job title from the title list

	onSelectJobTitle(job: any, index: number){
		this.jobAutocompleteList = [];

		if (index <= 5) {
			this.currentJob[index].title = job.jobTitle;
			this.currentJob[index].id = job.jobId;
		} else if (index == 6) {
			this.dreamJob.title = job.jobTitle;
			this.dreamJob.id = job.jobId;
		}
	}

	// When a job text field is focused

	onFocus(index: number){
		if (index >= 0 ){
			this.showJobAutocompleteList = index
		}
		else {
			this.showJobAutocompleteList = -1
		}
	}

	// Clear the job title list when the text field is cleared by either the clear button or deleted by the user

	onClear(index: number){
		if (index < 6 && this.currentJob[index].title == '')
			this.jobAutocompleteList = []
		else if (this.dreamJob.title == '' && index == 6)
			this.jobAutocompleteList = []
	}

	private logData(){
			// let dataRef = this.db.ref('/entries');
			// let jobRef = dataRef.push();
      //       let date = new Date();

			// let dataRecord = {
			// 	dream: this.dreamJob.title,
			// 	pastJob1: this.currentJob[0].title,
			// 	pastJob2: this.currentJob[1].title,
			// 	pastJob3: this.currentJob[2].title,
			// 	pastJob4: this.currentJob[3].title,
      //           timestamp: date.toLocaleString(),
			// }
			// jobRef.set(dataRecord)
			//dataRef.set({currentJobs: this.currentJob[0].title});
      let date = new Date().toISOString().slice(0, 10);;
      for(let i = 0; i < 4; i++){
        if(this.currentJob[i].title == ""){
          this.currentJob[i].title = "null";
        }
      }
      this._jobDataProvider.writeLog(this.dreamJob.title, this.currentJob[0].title,
        this.currentJob[1].title, this.currentJob[2].title, this.currentJob[3].title,
        date);
	}

}
