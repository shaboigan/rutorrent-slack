<?php

$req = new rXMLRPCRequest(array(
    rTorrentSettings::get()->getOnInsertCommand(array('tslack'.getUser(), getCmd('cat='))),
    rTorrentSettings::get()->getOnFinishedCommand(array('tslack'.getUser(), getCmd('cat='))),
    rTorrentSettings::get()->getOnEraseCommand(array('tslack'.getUser(), getCmd('cat=')))
));
$req->run();
