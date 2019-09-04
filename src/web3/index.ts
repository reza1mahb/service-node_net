import Web3 from 'web3'
import {admin} from './extender'
import net from 'net'
import IBootstrap from '../common/interfaces/IBootstrap'
import App from '../application';
import GethExecutor from '../commands/executor/GethExecutor'
import { Socket } from 'net';

export default class Web3Connector implements IBootstrap
{
    private app:App
    private web3: Web3
    private adminModule:any

    constructor(app:App)
    {
        this.web3 = new Web3();
        this.adminModule = admin(this.web3)
        this.app = app
    }


    public bootstrap():any
    {
        let geth: GethExecutor = this.app.getModule('geth')
        geth.on('geth::ipc::connect',(executor:GethExecutor, sock: Socket) => {
            this.web3.setProvider(new Web3.providers.IpcProvider(geth.getIpcPath(),net))
            // this.adminModule.admin.peers()
            this.adminModule.admin.peers((e:Error|null,r:string|Buffer) => {
                console.log(e,r)
            })
        })
        
    }
}