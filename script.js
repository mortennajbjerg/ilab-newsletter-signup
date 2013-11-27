(function ($) {
    'use strict';
    /*jslint nomen: true*/
    /*global jQuery*/
    /*global Backbone*/
    /*global _*/
    
    var NewsletterView, newsletterView, Lang, currentLanguage, t;
    
    /* Set the current Language */
    currentLanguage = 'en';
    
    /* Language object */
    Lang = {};
    Lang.dk = {
        'thankyou' : 'Tak for din tilmelding. Du har modtaget en bekræftelsesmail i din indbakke.',
        'wrongemail' : 'Den indtastede email er ikke korrekt',
        'alreadysignedup' : 'Du er allerede tilmeldt vores nyhedsbrev'
    };
    Lang.en = {
        'thankyou' : 'Thank you! You have received a confirmation mail in You inbox',
        'wrongemail' : 'The email adress is not correct',
        'alreadysignedup' : 'You have already subscribed to the newsletter'
    };
    
    /* Simple translation function */
    t = function (key) {
        return Lang[currentLanguage][key];
    };
    
    /* NewsletterView */
    NewsletterView = Backbone.View.extend({
        el: 'div',
        className: 'newsletter',
        template: $('#newsletter-tpl').html(),
        
        events: {
            'mouseover' : 'showMailboxTop',
            'mouseout' : 'hideMailbox',
            'focusin' : 'showMailbox',
            'focusout' : 'hideMailbox'
        },
        
        initialize: function () {
            _.bindAll(this, 'formCallback');
        },
        
        // Shows the mailbox
        showMailbox: function () {
            if (this.visible) { return false; }
            this.visible = true;
            
            this.$el.find('.mailbox').stop().animate({
                top : '-50px'
            }, 'fast');
        },
        
        // Shows a bit of the mailbox
        showMailboxTop: function () {
            if (this.visible) { return false; }
            this.$el.find('.mailbox').stop().animate({
                top : '-20px'
            }, 'fast');
        },
        
        // Hides the mailbox
        hideMailbox: function () {
            if (this.$el.find('#mc-email').is(':focus')) { return false; }
            this.visible = false;
            
            this.$el.find('.mailbox').stop().animate({
                top : '0'
            }, 'fast');
        },
        
        // Callback for ajaxChimp when the email has been submitted
        formCallback: function (resp) {
            var message, msgClass;
            
            if (resp.msg.indexOf("allerede tilmeldt") !== -1 && resp.result === 'error') {
                message = t('alreadysignedup');
            } else if (resp.result === 'error') {
                message = t('wrongemail');
            } else {
                message = t('thankyou');
            }
            
            msgClass = resp.result === 'success' ? 'success' : 'error';
            this.$el.find('.mc-response')
                .removeClass('success error')
                .html(message)
                .addClass(msgClass);
            this.$el.find('.mailbox').addClass(msgClass);
        },
        
        render: function () {
            var that;
            
            that = this;
            
            this.$el.html(this.template);
            
            this.$el.find('#mc-form').ajaxChimp({
                callback: that.formCallback,
                url: 'http://innovationlab.us1.list-manage2.com/subscribe/post?u=fc70916eb0c2ae54315959653&id=b10b28a12f'
            });
            
            return this.$el;
        }
        
    });
    
    newsletterView = new NewsletterView();
    $('.newsletter-wrap').append(newsletterView.render());
    
}(jQuery));