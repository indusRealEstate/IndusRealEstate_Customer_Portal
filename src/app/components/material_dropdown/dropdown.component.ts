import { Component, OnInit, Renderer2 } from '@angular/core';


/**
 * @title Basic menu
 */
@Component({
    selector: 'dropdown-btn',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss']
})
export class DropdownMaterial implements OnInit {
    
    enteredButton = false;
    isMatMenuOpen = false;
    isMatMenu2Open = false;
    prevButtonTrigger;

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    isPCMenu() {
        if ($(window).width() <= 991) {
            return false;
        }
        return true;
    }



    ngOnInit() {
    }

    menuenter() {
        this.isMatMenuOpen = true;
        if (this.isMatMenu2Open) {
            this.isMatMenu2Open = false;
        }
    }

    menuLeave(trigger, button) {
        setTimeout(() => {
            if (!this.isMatMenu2Open && !this.enteredButton) {
                this.isMatMenuOpen = false;
                trigger.closeMenu();
            } else {
                this.isMatMenuOpen = false;
            }
        }, 80)
    }

    menu2enter() {
        this.isMatMenu2Open = true;
    }

    menu2Leave(trigger1, trigger2, button) {
        setTimeout(() => {
            if (this.isMatMenu2Open) {
                trigger1.closeMenu();
                this.isMatMenuOpen = false;
                this.isMatMenu2Open = false;
                this.enteredButton = false;
            } else {
                this.isMatMenu2Open = false;
                trigger2.closeMenu();
            }
        }, 100)
    }

    buttonEnter(trigger) {
        setTimeout(() => {
            if (this.prevButtonTrigger && this.prevButtonTrigger != trigger) {
                this.prevButtonTrigger.closeMenu();
                this.prevButtonTrigger = trigger;
                this.isMatMenuOpen = false;
                this.isMatMenu2Open = false;
                trigger.openMenu();
            }
            else if (!this.isMatMenuOpen) {
                this.enteredButton = true;
                this.prevButtonTrigger = trigger
                trigger.openMenu();
            }
            else {
                this.enteredButton = true;
                this.prevButtonTrigger = trigger
            }
        })
    }

    buttonLeave(trigger, button) {
        setTimeout(() => {
            if (this.enteredButton && !this.isMatMenuOpen) {
                trigger.closeMenu();
            } if (!this.isMatMenuOpen) {
                trigger.closeMenu();
            } else {
                this.enteredButton = false;
            }
        }, 100)
    }

}


