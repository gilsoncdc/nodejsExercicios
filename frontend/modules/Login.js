export default class Login {

    constructor(formClass){
        this.form.querySelector(formClass);
    }

    init(){
        this.events();
    }

    events(){
        if(!this.form) return;
            
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate();
        });
    }

    validate(e){
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="password"]');
        console.log(emailInput.value, passwordInput.value);
    }

}