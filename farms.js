/*class for farms, takes the name and has an empty array for the features of the farm such
as barn, field, pasture, etc*/
class Farm {
    constructor(name) {
        this.name = name
        this.features = []
    }
/*add feature funtction that is called when add feature button is clicked and pushes
new feature to the features array of that farm*/
    addFeature(name) {
        this.features.push(new Feature(name))
    }
}
/*class for features, takes a name and has an array for the contents ie hours for a pasture,
wheat for a field etc*/
class Feature {
    constructor(name) {
        this.name = name
        this.contents = []
    }
/*add content function that is called when add content button is clicked, takes the name and quantity
goats, 3 tomato plants, 5 etc, and pushes it to contents array of that feature*/
    addContent(name) {
        this.contents.push(new Content(name, quantity))
    }
}
/*class for content, takes the name and quantity*/
class Content {
    constructor(name, quantity) {
        this.name = name
        this.quantity = quantity
    }
}
/*feature service class, has features url from mockapi and methods to render features and add feature
I didn't finish it by adding a delete feature method because I couldn't get what I have to work.
Got stuck and couldn't finish it*/
class FeatureService {
    static url= 'https://65e677b8d7f0758a76e870ed.mockapi.io/api/farm_app/features'

    static getAllFeatures() {
        return $.get(this.url)
    }

    static getFeature(id) {
        return $.get(this.url + `/${id}`)
    }

    static addFeature(feature) {
        return $.post(this.url, feature)
   }

}
/*farm service class to communicate with api to render the farms, methods to create, update, and delete farms*/
class FarmService {
    static url = 'https://65e677b8d7f0758a76e870ed.mockapi.io/api/farm_app/farms'

    static getAllFarms() {
        return $.get(this.url)
    }

    static getFarm(id) {
        return $.get(this.url + `/${id}`)
    }

    static createFarm(farm) {
         return $.post(this.url, farm)
    }

    static updateFarm(farm) {
        return $.ajax({
            url: this.url + `/${farm._id}`,
            dataType: 'json',
            data: JSON.stringify(farm),
            contentType: 'application/json',
            type: 'PUT'
        })
    }

    static deleteFarm(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: DELETE
        })
    }

}
/*class to manage the dom. has functions for getting all the farms, creating a new one, 
deleting a farm, and adding a feature that call on the methods from the farm service class 
which returns the promise and renders the data.*/
class DOMManager {
    static farms
    static getAllFarms() {
        FarmService.getAllFarms().then(farms => this.render(farms))
    }

    static createFarm(name) {
        FarmService.createFarm(new Farm(name))
        .then(() => {
            return FarmService.getAllFarms()
        })
        .then((farms) => this.render(farms))
    }

    static addFeature(name) {
        FeatureService.addFeature(new Feature(name))
        .then(() => {
            return FeatureService.getAllFeatures()
        })
        .then((features) => this.render(features))
    }

    static deleteFarm(id) {
        FarmService.deleteFarm(id)
         .then(() => {
            return FarmService.getAllFarms()
         })
         .then((farms) => this.render(farms))
    }
/*render farms function that makes everything appear in the "app" div. the inputs and buttons
show up but I couldn't get the name to appear as the header.*/
    static render(farms) {
        this.farms = farms
        $('#app').empty()
        for (let farm of farms) {
            $('#app').prepend(
                `<div id="${farm._id}" class="card>
                  <div class="card-header">
                    <h3>${farm.name}</h3>
                    <button class="btn btn-danger" onclick="DOMManager.deleteFarm('${farm._id}')">Delete</button> 
                  </div>
                  <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                            <input type="text" id="${farm._id}-feature-name" placeholder="Feature Name">
                            </div>
                            <div class="col-sm">
                            <button id="${farm._id}-new-feature" onclick="DOMManager.addFeature('${farm._id}')" class="btn btn-primary form-control">Add</button>
                            </div>
                        </div>
                    </div>
                  </div>
                </div><br>`
            )
            /*nested for loop that is supposed to render the features for each farm. 
            I finally got the "add feature button to do something, but it seems to just add another div that
            looks just like a farm div rather than listing the feature so it definitely doesn't work properly
            This nested loop doesn't seem to do anything because the feature name isn't rendered or the
            delete button */
            for (let feature of farm.features) {
                $(`#${farm._id }`).find('.card-body').append(
                    `<p>
                    <span id="name-${feature._id}">Name: ${feature.name}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteFeature('${farm._id}', '${feature._id}')">Delete<br>Feature</button>
                    </p>`
                )

            }
        }
    }
}
/*calling the getallfarms method to render the data from the api*/
DOMManager.getAllFarms()