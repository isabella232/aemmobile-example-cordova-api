/* ********************************************************

Context

**********************************************************/

// Context
function getEntityInfo() {
    var context_type = document.getElementById("context_type");
    var entity_type = document.getElementById("entity_type");
    var entity_metadata = document.getElementById("entity_metadata");
    var entity_rootpath = document.getElementById("entity_rootpath");
    context_type.innerHTML = cq.mobile.context.type;
    entity_type.innerHTML = cq.mobile.context.entity.type;
    entity_metadata.innerHTML = prettyPrintJSON(cq.mobile.context.entity.metadata);
    entity_rootpath.innerHTML = cq.mobile.context.entity.rootPath;
    debugLog(prettyPrintJSON(cq.mobile.context.entity.metadata));
}

function getCardImage() {
    cq.mobile.context.entity.getThumbnailImage(300, 300, imageSuccess,
        imageFailure);
}

function getBackgroundImage() {
    cq.mobile.context.entity.getBackgroundImage(300, 300, imageSuccess,
        imageFailure);
}

function getSocialImage() {
    cq.mobile.context.entity.getSocialSharingImage(300, 300, imageSuccess,
        imageFailure);
}

function getCollectionCardImage() {
    cq.mobile.context.collection.getThumbnailImage(300, 300, imageSuccess,
        imageFailure);
}

function getCollectionBackgroundImage() {
    cq.mobile.context.collection.getBackgroundImage(300, 300, imageSuccess,
        imageFailure);
}

function getCollectionSocialImage() {
    cq.mobile.context.collection.getSocialSharingImage(300, 300,
        imageSuccess, imageFailure);
}

function imageSuccess(imageInfo) {
    document.getElementById('entity_image').innerHTML = JSON.stringify(
        imageInfo);
    var img_obj = document.getElementById('entity_image_obj');
    img_obj.src = imageInfo;
}

function imageFailure(errorInfo) {
    document.getElementById('entity_image').innerHTML = JSON.stringify(
            errorInfo);
}
