(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["converse"], factory);
    } else {
        factory(converse);
    }
}(this, function (converse) {
    let Strophe, $iq, $msg, $pres, $build, b64_sha1, _ ,dayjs, Model, BootstrapModal, __,  _converse;		

    converse.plugins.add("polls", {
        'dependencies': [],

        'initialize': function () {
            _converse = this._converse;
            html = converse.env.html;

            Strophe = converse.env.Strophe;
            $iq = converse.env.$iq;
            $msg = converse.env.$msg;
            $pres = converse.env.$pres;
            $build = converse.env.$build;
            b64_sha1 = converse.env.b64_sha1;
            Model = converse.env.Model;
            BootstrapModal = converse.env.BootstrapModal;			
            _ = converse.env._;
            __ = _converse.__;			
            dayjs = converse.env.dayjs;	


            _converse.on('message', function (data)
            {
                var message = data.stanza;
                var chatbox = data.chatbox;
                var attachTo = data.stanza.querySelector('attach-to');
                var body = message.querySelector('body');
                var history = message.querySelector('forwarded');

                //console.debug("message", data);

            });

            _converse.api.listen.on('sendMessage', function(data)
            {
				//console.debug("sendMessage", data);
				
                const id = data.chatbox.get("box_id");
                const body = data.message.get("message");
				
			});
			
			
            _converse.api.listen.on('getToolbarButtons', function(toolbar_el, buttons)
            {
				const chatview = _converse.chatboxviews.get(toolbar_el.model.get('jid'));	
		
				if (chatview && chatview.model.get("type") === "chatroom") {
					buttons.push(html`
						<button class="polls-icon" title="${__('Polls')}" @click=${doPolls}/>
							<converse-icon class="fa fa-bars" size="1em"></converse-icon>
						</button>
					`);
				}
				return buttons;
			});

            console.log("Polls plugin is ready");
        }
    })

    function doPolls(ev) {
        ev.stopPropagation();
        ev.preventDefault();
		
		const toolbar_el = converse.env.utils.ancestor(ev.target, 'converse-chat-toolbar');
		const chatview = _converse.chatboxviews.get(toolbar_el.model.get('jid'));		
		console.debug("doPolls", chatview, toolbar_el.model);
		
		const jid = toolbar_el.model.get("jid");
		const id = toolbar_el.model.get("box_id");
		const occupants = chatview.querySelector('.occupants');	

		console.debug("doPolls", jid, id, occupants);	
		togglePollsBar(chatview, id, jid);
    }
	
    function togglePollsBar(view, id, jid) {
        const chatroom_body = view.querySelector('.chatroom-body');
        let polls_area = view.querySelector('.occupants-pade-polls');

		console.debug("togglePollsBar", view, jid, id);
		
        if (!polls_area)
        {
            polls_area = document.createElement("div");
            polls_area.classList.add('occupants-pade-polls');
            polls_area.classList.add('col-md-3');
            polls_area.classList.add('col-4');
            chatroom_body.appendChild(polls_area);
        }

        const occupants_area = view.querySelector('.occupants.col-md-3.col-4');

        if (occupants_area.style.display != "none")
        {
			view.model.save({'hidden_occupants': true});			
            occupants_area.style.display = "none";

            polls_area.innerHTML = '<div class="plugin-pollsbox">' + getHTML(id, jid) + '</div>';
            polls_area.style.display = "";
			
			polls_area.querySelector("#create-poll").addEventListener('click', function(evt)
			{
				evt.stopPropagation();
				console.log("togglePollsBar - create poll", evt.target);

			}, false);	

            createPolls(jid, id);			

        } else {
			view.model.save({'hidden_occupants': false});	
            occupants_area.style.display = "";
            polls_area.style.display = "none";
        }
        view.scrollDown();
    }	

    function getHTML(id, jid)  {
        console.debug("getHTML", jid, id);

        var html = getEmptyPolls();

        return html;
    }
	
    function createPolls(jid, id)   {
        console.debug("createPolls", jid, id);
    }	
	
	function getEmptyPolls() {
		return `
<div aria-labelledby="polls-tab" id="polls-panel" role="tabpanel" >
   <div class="polls-pane-content">
      <div class="poll-container">
         <div class="pane-content">
            <div class="jitsi-icon jitsi-icon-default empty-pane-icon">
               <svg height="22" width="22" viewBox="0 0 24 24">
                  <path d="M18 8.016V6H6v2.016h12zm-3.984 6V12H6v2.016h8.016zM6 9v2.016h12V9H6zm14.016-6.984c1.078 0 1.969.891 1.969 1.969v12c0 1.078-.891 2.016-1.969 2.016H6l-3.984 3.984v-18c0-1.078.891-1.969 1.969-1.969h16.031z"></path>
               </svg>
            </div>
            <span class="empty-pane-message">There are no polls in the meeting yet. Start a poll here!</span>
         </div>
      </div>
      <div class="poll-footer poll-create-footer"><button id="create-poll" title="Create a poll" class="poll-button poll-button-primary"><span>Create a poll</span></button></div>
   </div>
</div>
`		
	}
	

    function hideElement(el) {
        return addClass("hiddenx", el);
    }

    function addClass(className, el) {
      if (el instanceof Element)
      {
        el.classList.add(className);
      }
      return el;
    }

	function newElement(el, id, html, className) {
		const ele = document.createElement(el);
		if (id) ele.id = id;
		if (html) ele.innerHTML = html;
		if (className) ele.classList.add(className);
		document.body.appendChild(ele);
		return ele;
	}
    
	function removeClass(className, el)  {
      if (el instanceof Element)
      {
        el.classList.remove(className);
      }
      return el;
    }
	
	function injectMessage(model, title, body, json) {
		const msgid = 'inject-' + Math.random().toString(36).substr(2,9);
		const type = model.get("type") == "chatbox" ? "chat" : "groupchat";
		const from = model.get("jid");

		let attrs = {json, body, message: body, id: msgid, origin_id: msgid, msgid, type, from: _converse.jid, is_unstyled: false, references: []}; 
		
		if (type == "groupchat") {
			attrs = {json, body, message: body, id: msgid, origin_id: msgid, msgid, type, from_muc: from, from: from + '/' + title, nick: title, is_unstyled: false, references: []};  
		}
		
		model.queueMessage(attrs);		
	}
	
	function getSetting(name, defaultValue) {
		const localStorage = window.localStorage
		let value = defaultValue;
		//console.debug("getSetting", name, defaultValue, localStorage["store.settings." + name]);
		
		if (localStorage["store.settings." + name])
		{
			try {
				value = JSON.parse(localStorage["store.settings." + name]);
				if (name == "password") value = getPassword(value, localStorage);
			} catch (e) {
				console.error(e);
			}
		}

		return value;
	}

	function setSetting(name, value) {
		//console.debug("setSetting", name, value);
		window.localStorage["store.settings." + name] = JSON.stringify(value);
	}	
}));
