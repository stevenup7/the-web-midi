// make a configManager class that will save config json object to localStorage

export default class ConfigManager {
  configLocation = "__config__";
  config: any; //TODO better type ?

  constructor(configLocation?: string) {
    if (configLocation) this.configLocation = configLocation;
    this.config = this.loadCurrentConfig();
  }

  private loadCurrentConfig(): object {
    let storedString = localStorage.getItem(this.configLocation);
    if (!storedString) {
      return {};
    }
    return JSON.parse(storedString);
  }
  private saveCurrentConfig(): void {
    localStorage.setItem(this.configLocation, JSON.stringify(this.config));
    //console.log("saved config", JSON.stringify(this.config));
  }

  reset() {
    this.config = {};
    this.saveCurrentConfig();
  }
  saveObject(key: string, configObject: any): void {
    let jsonConfig: string;
    // console.log(typeof configObject);
    if (
      typeof configObject == "object" &&
      typeof configObject.toJSON == "function"
    ) {
      jsonConfig = configObject.toJSON();
    } else {
      jsonConfig = JSON.stringify(configObject);
    }

    if (key.indexOf(".") > -1) {
      const keyParts = key.split(".");
      let currRef = this.config;
      keyParts.forEach((keyPart, index) => {
        if (index == keyParts.length - 1) {
          currRef[keyPart] = jsonConfig;
        } else if (currRef[keyPart] == undefined) {
          currRef[keyPart] = {};
        }
        currRef = currRef[keyPart];
      });
    } else {
      this.config[key] = jsonConfig;
    }
    this.saveCurrentConfig();
  }
  deleteObject(key: string): void {
    if (key.indexOf(".") > -1) {
      const keyParts = key.split(".");
      let currRef = this.config;
      keyParts.forEach((keyPart, index) => {
        if (index == keyParts.length - 1) {
          delete currRef[keyPart];
        }
        currRef = currRef[keyPart];
      });
    } else {
      delete this.config[key];
    }
    this.saveCurrentConfig();
  }

  getConfig(key: string): any {
    let returnVal = undefined;
    if (key.indexOf(".") > -1) {
      const keyParts = key.split(".");
      let currRef = this.config;
      keyParts.forEach((keyPart, index) => {
        if (currRef[keyPart] == undefined) {
          returnVal = undefined;
        }
        if (index == keyParts.length - 1 && currRef[keyPart] !== undefined) {
          returnVal = JSON.parse(currRef[keyPart]);
        }
        currRef = currRef[keyPart];
      });
    } else {
      // console.log("get config", key, this.config[key]);
      if (typeof this.config[key] == "object") {
        returnVal = this.config[key];
        if (typeof returnVal == "object") {
          for (let prop in returnVal) {
            if (returnVal[prop] !== undefined) {
              if (typeof returnVal[prop] == "string") {
                returnVal[prop] = JSON.parse(returnVal[prop]);
              } else {
                returnVal[prop] = returnVal[prop];
              }
            }
          }
        }
      } else {
        if (this.config[key] !== undefined) {
          returnVal = JSON.parse(this.config[key]);
        }
      }
    }
    return returnVal;
  }
}
