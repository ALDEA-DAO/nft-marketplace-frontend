import { Lucid, Assets, C, fromHex, PaymentKeyHash, Redeemer, toHex, UTxO, Data, Constr, TxHash, Script, TxComplete, TxSigned,  } from "lucid-cardano";


export const marketplaceScript =  {
    address: 'addr_test1wpg63evuzvd6sjq08lqe7993qkrd77j37dcv300cmvzv4kccht36p',
    hash: {"bytes":"51a8e59c131ba8480f3fc19f14b10586df7a51f370c8bdf8db04cadb"},
    type: 'PlutusScriptV2',
    cborHex: '5909065909030100003232323232323232323232323232323232323232323232323232323232323232323232323232323232222325335533553335734605400204a2a666ae68c0a400406c0a04c94ccd5cd19b883302e223350014800088d4008894ccd5cd19b8f002488100133034223350014800088d4008894ccd5cd19b8f0024890010011300600300113006003333553023025223355302602723500122330250023355302902a2350012233028002333500137009000380233700002900000099aa981301391a8009119812801199a800919aa981501591a8009119814801180900080091199807006801000919aa981501591a8009119814801180980080099980480400100080d991a9a9806802014111111111111199aa9818019111a80111111a8021119a80112999ab9a3371e02c00226607c00c010201040100500146a00203c6a002444002266ae7124012b414c444541204d61726b6574204e46543a204d6f6e746f206465207061676f20696e636f72726563746f210001d026300a00413253353535300c003027222222222222533533355302d0313302c22533500221003100102925333573466e3c0380044c0b00040a401080cc0a00984cd5ce248139414c444541204d61726b6574204e46543a20536f6c6f20656c2076656e6465646f7220707565646520726563757065726172207375204e46540001d35300a00401d1120011635573a6ea800888ccd5cd19b8f00200101701922233355301f02102433553020021235001223301f002300800133355301f0212235002225335333553021025330202233300a0290020013008022235001223300a002005006100313302800400301700133553020021235001223301f0023302d2253350011300b003221350022253353300c002008112223300200a0041300600300400223300122533500202110010162122230030042122230010042325333573460426aae740044c8c8c8c8c8c848ccc00401800c008dd69aba135744006a666ae68c094d55ce8008991980e1bae357420026eb8d5d09aba200135573c0020486ea8d5d08009aba2002375c6ae84004d55cf0008101baa0012325333573460406aae740044c8c8c8c848cc00400c008c038d5d09aba20035333573460446aae740044c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c848cccccccccccc00406005805004804003803002401c01400c008c0a4d5d09aba200233302175c40026ae84004d5d100119980f81090009aba1001357440046603ceb8d5d08009aba20035333573460646aae740044c8c8c8c8c848cc0040100094ccd5cd181b1aab9d00113232321233001003002301b357426ae88008cc06dd69aba100135573c00206a6ea8d5d09aba20035333573460686aae740044c8c8c848cc00400c008c064d5d09aba20023301975a6ae84004d55cf0008199baa357420026aae780040c4dd51aba100135744004666030038eb4d5d08009aba200233017019357420026ae88008ccc051d70099aba100135744004666024eb8044d5d08009aba20023301100d357420026ae88008cc03c028d5d08009aba20023300d008357420026aae78004084dd51aba100135573c00203e6ea80048c94ccd5cd181000080d8a999ab9a301f00101101e35573a6ea800488c8c94ccd5cd1811000889110008a999ab9a3021001132122230030043004357426aae7800854ccd5cd18100008891100100f9aab9d0013754002464a666ae68c074d55ce8008991919091980080180118029aba135744004601a6ae84004d55cf00080e1baa0012325333573460386aae740044c8c8c8c8c8c8c8c8c8c848cccc00402401c00c008cc031d71aba135744008a666ae68c0980044c84888c008010d5d09aab9e002153335734604a002264244460020086eb8d5d09aab9e0021533357346048002224440060466aae74004dd51aba100135744004666012eb8020d5d08009aba200353335734603c6aae740044c8c8c848cc00400c008cc01c034d5d09aba2002300d357420026aae78004074dd51aba100135573c0020366ea800488c8c94ccd5cd180e8008980918021aba135573c0042a666ae68c07800403c070d55ce8009baa0013300175ceb4888cc07888cccd55cf80090071191980e1980a18039aab9d001300635573c00260086ae8800cd5d080100b9bab001223301c2233335573e0024018466032600a6ae84008c00cd5d100100a9bac0012323253335734603600226424444600800a60086ae84d55cf0010a999ab9a301a0011321222230020053005357426aae7800854ccd5cd180c80089909111180080298039aba135573c0042a666ae68c0600044c848888c00c014dd71aba135573c00402e6aae74004dd500091919192999ab9a3370e90060010891110080a999ab9a3370e90050010891111110020a999ab9a3370e90040010991909111111198008048041bad357426ae894008dd71aba1500115333573460360042646424444444660040120106eb8d5d09aba25002375c6ae85400454ccd5cd180d0010991909111111198030048041bae357426ae894008c014d5d0a8008a999ab9a30190021321222222230070083005357426aae7800c54ccd5cd180c00109909111111180280418029aba135573c00602e26aae78008d55ce8009baa0012323253335734602e0022646464646424466600200c0080066eb4d5d09aba2002375a6ae84004d5d10011bad357420026aae7800854ccd5cd180b000899091180100198021aba135573c00402a6aae74004dd5000919192999ab9a30160011321223001003375c6ae84d55cf0010a999ab9a30150011321223002003375c6ae84d55cf00100a1aab9d0013754002464a666ae68c04cd55ce800899191909198008018011bad357426ae88008c010d5d08009aab9e0010123754002464a666ae68c048d55ce80089bae357426aae78004044dd50008806080088029110019091180100191091980080180118069108911299a80089a801803110999a8028069802001199aa98038058028020009100098059108911299a800880111099802801199aa98038048028020009805110891299a80080311099805180200119aa980300380200089000888009100111091198008020018a99ab9c491035054310016370e90001b8748008dc3a40086e1d200623230010012233003300200200101'
};