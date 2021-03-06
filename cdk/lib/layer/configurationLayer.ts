import { Construct } from '@aws-cdk/cdk';
import { ResourceAwareConstruct, IParameterAwareProps } from './../resourceawarestack'
import ssm = require('@aws-cdk/aws-ssm');


/**
 * Configuration Layer is a construct designed to acquire and store configuration
 * data to be used by the system
 */
export class ConfigurationLayer extends ResourceAwareConstruct {

    constructor(parent: Construct, name: string, props: IParameterAwareProps) {
        super(parent, name, props);
        if (props) {
            let parametersToBeCreated = props.getParameter('ssmParameters');
            if (parametersToBeCreated) {
                parametersToBeCreated.forEach( (v : any, k : string) => {
                    let parameter = this.createParameter(props.getApplicationName(),k,<string> v);
                    this.addResource('parameter.'+k,parameter);
                });
            }
        }
    }       

    private createParameter(appName : string, keyName: string, value : string) {    
        let baseName : string = '/'+ appName.toLowerCase();
        let parameter = new ssm.CfnParameter(this, 'SSMParameter'+appName+keyName, {
            name: baseName + '/'+keyName.toLowerCase(),
            type: 'String',
            value: value
        });
        return parameter;
    }
}
