//Storage Controller

//Item Controller   
const ItemCtrl=(function(){

    //item Constructor
    const Item =function(id,name,calories){
        this.id=id;
        this.name=name;
        this.calories=calories;
    }

    //Data Structure
    const data={
        items:[
           
        ],
        currentItem:null,
        totalCalories:0
    }
    //Public Methods
   return {
       getItems:function(){
           return data.items;
       },
       
       addItem:function(name,calories){
            //create ID
            if(data.items.length>0){
                ID=data.items[data.items.length-1].id+1;
            }else{
                ID=0;
            }   
            //Calories to number
            calories=parseInt(calories);

            //Create new item
            newItem=new Item(ID,name,calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
       },

       getItemById:function(id){
           let found=null;
           data.items.forEach(function(item){
               if(item.id===id){
                   found=item;
               }
           });
           console.log(found);
           return found;
       },
       updateItem:function(name,calories){
        calories=parseInt(calories);

        let found=null;

        data.items.forEach(function(item){
            if(item.id===data.currentItem.id){
                item.name=name;
                item.calories=calories;
                found=item;
            }
        });
        return found;
       },
       deleteItem:function(id){
        //Get ids

        ids=data.items.map(function(item){
            return item.id;
        });

        //Get index
        const index=ids.indexOf(id);
        //Remove item
        data.items.splice(index,1);

       },
       clearAllItems:function(){
        data.items=[];
       },
       setCurrentItem:function(item){
           data.currentItem=item;
       },
       getCurrentItem:function(){
            return data.currentItem;
       },
       getTotalCalories:function(){
           let total=0;

           data.items.forEach(function(item){
            total+=item.calories;
           });
           
           data.totalCalories=total;
           return data.totalCalories;
       },

       logData:function(){
        return data;
    }
   }
})();

//UI Controller
const UICtrl=(function(){
   
    const UISelectors={
        itemList:"#item-list",
        listItems:"#item-list li",
        addBtn:".add-btn",
        itemNameInput:"#item-name",
        itemCaloriesInput:"#item-calories",
        totalCalories:".total-calories",
        updateBtn:".update-btn",
        deleteBtn:".delete-btn",
        backBtn:".back-btn",
        clearBtn:".clear-btn"
    }

    //Public Methods
    return{
        populateItemList:function(items){
            
            let html="";
            items.forEach(function(item){
                html+=`<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`
            });
            //Insert ListItems
            document.querySelector(UISelectors.itemList ).innerHTML=html;
        },

        getItemInput:function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem:function(item){

                //Show List
                document.querySelector(UISelectors.itemList).style.display="block";
           
                //Create li element
                const li=document.createElement("li");
                //Add Class Name
                li.className="collection-item";
                //Add ID
                li.id=`item-${item.id}`;

                //Add HTML 
                li.innerHTML=` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`;

                //Insert item
                document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend",li);
            
        },
        updateListItem:function(item){

            let listItems=document.querySelectorAll(UISelectors.listItems);

            //Convert Node list into array
            listItems=Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID=listItem.getAttribute("id");
                if(itemID===`item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML=` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },

        deleteListItem:function(id){
            const itemID=`#item-${id}`;
            const item=document.querySelector(itemID);
            item.remove();
        },

        clearInput:function(){
            document.querySelector(UISelectors.itemNameInput).value="";
            document.querySelector(UISelectors.itemCaloriesInput).value="";
        },
        addItemToForm:function(){
            document.querySelector(UISelectors.itemNameInput).value=ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value=ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems:function(){
            let listItems=document.querySelectorAll(UISelectors.listItems);
            //Turn nodeList into array
            listItems=Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },
        hideList:function(){
            document.querySelector(UISelectors.itemList).style.display="none";
        },

        showTotalCalories:function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent=totalCalories;
        },
        clearEditState:function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display="none";
            document.querySelector(UISelectors.deleteBtn).style.display="none";
            document.querySelector(UISelectors.backBtn).style.display="none";
            document.querySelector(UISelectors.addBtn).style.display="inline";
        },
        showEditState:function(){
            document.querySelector(UISelectors.updateBtn).style.display="inline";
            document.querySelector(UISelectors.deleteBtn).style.display="inline";
            document.querySelector(UISelectors.backBtn).style.display="inline";
            document.querySelector(UISelectors.addBtn).style.display="none";
        },
        getSelectors:function(){
            return UISelectors;
        }
    }
})();


//App Controller
const App=(function(ItemCtrl,UICtrl){
    
    // Load Event Listeners
    const loadEventListeners=function(){
        const UISelectors=UICtrl.getSelectors();

        //Add Item event
        document.querySelector(UISelectors.addBtn).addEventListener("click",itemAddSubmit);

        //Disable submit on enter
        document.addEventListener("keypress",function(e){
            if(e.keyCode===13 || e.which===13){
                e.preventDefault();
                return false;
            }
        })

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener("click",itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener("click",itemUpdateSubmit);

         //Delete item event
         document.querySelector(UISelectors.deleteBtn).addEventListener("click",itemDeleteSubmit);

        //Back Button Event
        document.querySelector(UISelectors.backBtn).addEventListener("click",UICtrl.clearEditState);
        
         //Clear item event
         document.querySelector(UISelectors.clearBtn).addEventListener("click",clearAllItemsClick);
    }

    const itemAddSubmit=function(e){
        
        //Get form input from UI Controller
        const input=UICtrl.getItemInput();

        if(input.name!==""&&input.calories!==""){
            //Add Item
            const newItem=ItemCtrl.addItem(input.name,input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);  
            
            //Get total calories
            const totalCalories=ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Clear fields after adding
            UICtrl.clearInput();

        }
 
        e.preventDefault();
    }

    //Update item edit item
    const itemEditClick=function(e){

        if(e.target.classList.contains("edit-item")){
            //Get list item id(item-0,item-1)
            const listId=e.target.parentNode.parentNode.id;

            //split at - to get two arrays one of item and other of number(id number)

            const listIdArr=listId.split("-");

            //get actual ID
            const id=parseInt(listIdArr[1]); 

            //Get item
            const itemToEdit=ItemCtrl.getItemById(id);
            
            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }
        

        e.preventDefault();
    }

    //Update item submit
    const itemUpdateSubmit=function(e){
        
        //Get item input

        const input=UICtrl.getItemInput();

        //Update item
        const updatedItem=ItemCtrl.updateItem(input.name,input.calories);
        
        //Update UI

        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories=ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState(); 
        
        e.preventDefault();
    }

    //Delete Button event
    const itemDeleteSubmit=function(e){

        //Get current Item
        const currentItem=ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

         //Get total calories
         const totalCalories=ItemCtrl.getTotalCalories();

         //Add total calories to UI
         UICtrl.showTotalCalories(totalCalories);
         
         UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick=function(){
     //Delete all items from data structure
        ItemCtrl.clearAllItems();

         //Get total calories
         const totalCalories=ItemCtrl.getTotalCalories();

         //Add total calories to UI
         UICtrl.showTotalCalories(totalCalories);

        //remove from UI
        UICtrl.removeItems();  

        //Hide Ui
        UICtrl.hideList();
         
    }
    //Public methods
    return {
        init:function(){
            
            //Calling clear edit state/ set initial state
            UICtrl.clearEditState();

            //Fetch items from Data Structures
            const item=ItemCtrl.getItems();

            //Check if any items
            if(item.length==0){
                UICtrl.hideList();
            }else{
                 //populate list with default items
                UICtrl.populateItemList(item);
            }
           //Get total calories
           const totalCalories=ItemCtrl.getTotalCalories();

           //Add total calories to UI
           UICtrl.showTotalCalories(totalCalories);

            //load event Listners
            loadEventListeners();
        }
    }

})(ItemCtrl,UICtrl);


App.init();