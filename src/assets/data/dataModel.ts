export interface jobInformation{
	id: string;
	occupation: string;
	group: string
}

export interface skillInformation{
	name: string;
	description: string;
	score: number;
	selected: boolean;
}

export interface gigInformation{
	description: string;
	o_net_cat: string;
	skills: string[];
	title: string;
	url: string;
}

export interface relatedJobInformation{
	job_uuid: string;
	job_title: string;
	importance: number;
	level: number; 
	normalized_job_title: string;
	score: number;
}