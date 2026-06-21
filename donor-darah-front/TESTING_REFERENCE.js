localStorage.setItem("user_blood_type", "A+");
localStorage.setItem("user_id", "1");
localStorage.setItem("active_request_id", "1");
localStorage.setItem("user_blood_type", "O+");   
localStorage.setItem("user_blood_type", "AB+"); 
localStorage.setItem("user_blood_type", "B-");  

import { isCompatible, getCompatibleRecipients } from "@/utils/bloodTypeCompatibility";

console.log(isCompatible("O-", "AB+"));    
console.log(isCompatible("B-", "A+"));     
console.log(isCompatible("O-", "A+"));     
console.log(getCompatibleRecipients("O-")); 
console.log(getCompatibleRecipients("A+"));
console.log(localStorage.getItem("user_blood_type")); 
console.log(donor.blood_type);                        

localStorage.setItem("user_blood_type", "A+");
localStorage.setItem("user_blood_type", "O+");
localStorage.setItem("user_blood_type", "AB+");
localStorage.setItem("user_blood_type", "AB+"); 