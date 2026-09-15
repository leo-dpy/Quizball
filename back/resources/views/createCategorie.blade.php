@extends('base')

@section('content')

<h1>Ajouter une catégorie</h1>
<form method="POST" action="{{route('storecategorie')}}" class="form-select">
    @csrf
    <div class="form-group">
        <label for="">Catégorie</label>
        <input type="text" class="form-control" name="categorie" id="categorie">
    </div>
    <div class="form-group">
        <button type="submit" class="btn btn-primary">Ajouter</button>
    </div>
</form>