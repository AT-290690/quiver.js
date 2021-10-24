INFO[PARAMS] :: { end, res, age, CODES } ->
info := 'Lorem ispum dolor bla bla'
<- {...value, info}
	INFO[SEND] :: { info, end, res, age, CODES } -> end(res).status(CODES.SUCCESS).send(info)