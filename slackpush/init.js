//plugin.loadLang();
plugin.mark = 0;
plugin.hstTimeout = null;

plugin.actionNames = ['', '', '', ''];

if(plugin.canChangeOptions())
{
    plugin.addAndShowSettings = theWebUI.addAndShowSettings;
    theWebUI.addAndShowSettings = function( arg )
    {
        if(plugin.enabled)
        {
            $('#slack_webhook').val( theWebUI.slack.slack_webhook );
            $('#slack_avatar').val( theWebUI.slack.slack_avatar );
            $('#slack_pushuser').val( theWebUI.slack.slack_pushuser );
            $$('slack_enabled').checked = ( theWebUI.slack.slack_enabled != 0 );
            $$('slack_addition').checked = ( theWebUI.slack.slack_addition != 0 );
            $$('slack_finish').checked = ( theWebUI.slack.slack_finish != 0 );
            $$('slack_deletion').checked = ( theWebUI.slack.slack_deletion != 0 );

            $('#slack_enabled').change();

            //plugin.rebuildNotificationsPage();
        }
        plugin.addAndShowSettings.call(theWebUI,arg);
    }

    theWebUI.slackWasChanged = function()
    {
        return(($$('slack_enabled').checked != ( theWebUI.slack.slack_enabled != 0 )) ||
        ($$('slack_addition').checked != ( theWebUI.slack.slack_addition != 0 )) ||
        ($$('slack_finish').checked != ( theWebUI.slack.slack_finish != 0 )) ||
        ($$('slack_deletion').checked != ( theWebUI.slack.slack_deletion != 0 )) ||
        ($('#slack_avatar').val() != theWebUI.slack.slack_webhook) ||
        ($('#slack_pushuser').val() != theWebUI.slack.slack_webhook) ||
        ($('#slack_webhook').val() != theWebUI.slack.slack_webhook));
    }

    plugin.setSettings = theWebUI.setSettings;
    theWebUI.setSettings = function()
    {
        plugin.setSettings.call(this);
        if( plugin.enabled && this.slackWasChanged() )
            this.request( "?action=setslack" );
    }

    rTorrentStub.prototype.setslack = function()
    {
        this.content = "cmd=set" +
            "&slack_addition=" + ( $$('slack_addition').checked ? '1' : '0' ) +
            "&slack_deletion=" + ( $$('slack_deletion').checked  ? '1' : '0' ) +
            "&slack_finish=" + ( $$('slack_finish').checked  ? '1' : '0' ) +
            "&slack_enabled=" + ( $$('slack_enabled').checked  ? '1' : '0' ) +
            "&slack_avatar=" + $('#slack_avatar').val() +
            "&slack_pushuser=" + $('#slack_pushuser').val() +
            "&slack_webhook=" + $('#slack_webhook').val();

        this.contentType = "application/x-www-form-urlencoded";
        this.mountPoint = "plugins/slackpush/action.php";
        this.dataType = "script";
    }
}

if(plugin.canChangeTabs() || plugin.canChangeColumns())
{
    plugin.config = theWebUI.config;
    theWebUI.config = function(data)
    {
        plugin.config.call(theWebUI,data);
    }

    rTorrentStub.prototype.getslack = function()
    {
        this.content = "cmd=get&mark=" + plugin.mark;
        this.contentType = "application/x-www-form-urlencoded";
        this.mountPoint = "plugins/history/action.php";
        this.dataType = "json";
    }

    if(!$type(theWebUI.getTrackerName))
    {
        theWebUI.getTrackerName = function(announce)
        {
            var domain = '';
            if(announce)
            {
                var parts = announce.match(/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/);
                if(parts && (parts.length>6))
                {
                    domain = parts[6];
                    if(!domain.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/))
                    {
                        parts = domain.split(".");
                        if(parts.length>2)
                        {
                            if($.inArray(parts[parts.length-2]+"", ["co", "com", "net", "org"])>=0 ||
                                $.inArray(parts[parts.length-1]+"", ["uk"])>=0)
                                parts = parts.slice(parts.length-3);
                            else
                                parts = parts.slice(parts.length-2);
                            domain = parts.join(".");
                        }
                    }
                }
            }
            return(domain);
        }
    }

    if(plugin.canChangeMenu())
    {
        /*dxSTable.prototype.historySelect = function(e,id)
        {
            if(plugin.enabled && plugin.allStuffLoaded && (e.which==3))
            {
                var self = "theWebUI.getTable('"+this.prefix+"').";
                theContextMenu.clear();
                theContextMenu.add([theUILang.Remove, self+"cmdHistory('delete')"]);
                theContextMenu.show(e.clientX,e.clientY);
            }
        }*/
    }
}

if(plugin.canChangeMenu())
{

    plugin.createMenu = theWebUI.createMenu;
    theWebUI.createMenu = function( e, id )
    {
        plugin.createMenu.call(this, e, id);
        if(plugin.enabled && plugin.allStuffLoaded && theWebUI.slack.slack_enabled)
        {
            /*var table = this.getTable("trt");
            var el = theContextMenu.get(theUILang.peerAdd);
            if( el )
            {
                if(table.selCount==1)
                {
                    theContextMenu.add(el,[CMENU_CHILD, 'Pushbullet',
                        [
                            [ theUILang.turnNotifyOn, theWebUI.torrents[id].pushbullet ? "theWebUI.setPushbullet('')" : null ],
                            [ theUILang.turnNotifyOff, theWebUI.torrents[id].pushbullet ? null : "theWebUI.setPushbullet('1')" ]
                        ]]);
                }
                else
                {
                    theContextMenu.add(el,[CMENU_CHILD, 'Pushbullet',
                        [
                            [ theUILang.turnNotifyOn, "theWebUI.setPushbullet('1')" ],
                            [ theUILang.turnNotifyOff, "theWebUI.setPushbullet('')" ]
                        ]]);
                }
            }*/
        }
    }
}

plugin.onLangLoaded = function()
{
    injectScript(plugin.path+"/desktop-notify.js",function()
    {
        plugin.attachPageToOptions( $("<div>").attr("id","st_slack").html(
            "<fieldset>"+
            "<legend><a href='https://slackapp.com/developers/applications/me' target='_blank'>slack Notifications</a></legend>"+
            "<div class='checkbox'>" +
            "<input type='checkbox' id='slack_enabled' onchange=\"linked(this, 0, ['slack_webhook','slack_avatar','slack_pushuser','slack_addition','slack_deletion','slack_finish']);\"/>"+
            "<label for='slack_enabled'>Enabled</label>"+
            "</div>" +
            "<div>" +
            "<label for='slack_webhook' id='lbl_slack_webhook' class='disabled'>slack Webhook URL</label>"+
            "<input type='text' id='slack_webhook' class='TextboxLarge' disabled='true' />"+
            "</div>" +
            "<div>" +
            "<label for='slack_avatar' id='lbl_slack_avatar' class='disabled'>Override Avatar URL</label>"+
            "<input type='text' id='slack_avatar' class='TextboxLarge' disabled='true' />"+
            "</div>" +
            "<div>" +
            "<label for='slack_pushuser' id='lbl_slack_pushuser' class='disabled'>Override Push Username</label>"+
            "<input type='text' id='slack_pushuser' class='TextboxLarge' disabled='true' />"+
            "</div>" +
            "<div class='checkbox'>" +
            "<input type='checkbox' id='slack_addition' disabled='true' />"+
            "<label for='slack_addition' id='lbl_slack_addition' class='disabled'>Addition</label>"+
            "</div>" +
            "<div class='checkbox'>" +
            "<input type='checkbox' class='disabled' id='slack_deletion' disabled='true' />"+
            "<label for='slack_deletion' id='lbl_slack_deletion' class='disabled'>Deletion</label>"+
            "</div>" +
            "<div class='checkbox'>" +
            "<input type='checkbox' id='slack_finish' disabled='true' />"+
            "<label for='slack_finish' id='lbl_slack_finish' class='disabled'>Finish</label>"+
            "</div>" +
            "</fieldset>"
        )[0], "slack" );
        plugin.actionNames = ['', "Added", "Finished", "Deleted"];
        plugin.markLoaded();
    });
}

plugin.onRemove = function()
{
    plugin.removePageFromOptions("st_slack");
    //theRequestManager.removeRequest( "trt", plugin.reqId1 );
}

/*plugin.langLoaded = function()
{
    if(plugin.enabled)
        plugin.onLangLoaded();
}*/
if(plugin.enabled)
    plugin.onLangLoaded();