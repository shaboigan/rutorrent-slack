<?php

require_once( $rootPath.'/plugins/slackpush/slack.php' );

$slack = slack::load();
if($slack->setHandlers())
{
    $theSettings->registerPlugin($plugin["name"],$pInfo["perms"]);
    $jResult .= $slack->get();
}
else
    $jResult .= "plugin.disable(); noty('slack: Failed to start the plugin','error');";
